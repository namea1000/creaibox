const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

// 1. Manually parse .env.local
const envPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.\-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      // Remove surrounding quotes if present
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      if (value.startsWith("'") && value.endsWith("'")) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  });
}

const clientId = process.env.GCP_OAUTH_CLIENT_ID;
const clientSecret = process.env.GCP_OAUTH_CLIENT_SECRET;
const refreshToken = process.env.GCP_OAUTH_REFRESH_TOKEN;
const rootFolderId = process.env.GDRIVE_FREE_ASSETS_FOLDER_ID;

if (!clientId || !clientSecret || !refreshToken || !rootFolderId) {
  console.error("Missing Google Drive environment variables.");
  process.exit(1);
}

// 2. Initialize Drive Client
const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
oauth2Client.setCredentials({ refresh_token: refreshToken });
const drive = google.drive({ version: 'v3', auth: oauth2Client });

async function uploadFile(filePath, fileName, mimeType) {
  const mediaStream = fs.createReadStream(filePath);
  
  const fileMetadata = {
    name: fileName,
    parents: [rootFolderId],
  };

  const media = {
    mimeType,
    body: mediaStream,
  };

  const response = await drive.files.create({
    requestBody: fileMetadata,
    media,
    fields: 'id',
  });

  const fileId = response.data.id;
  
  // Make it public readable
  await drive.permissions.create({
    fileId,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
  });

  return fileId;
}

async function run() {
  const targetDir = path.join(__dirname, '../public/images/free-assets');
  if (!fs.existsSync(targetDir)) {
    console.error("Local free-assets directory does not exist.");
    return;
  }

  // Find asset files from asset_1.png to asset_22.png
  const filesToUpload = [];
  for (let i = 1; i <= 22; i++) {
    const filename = `asset_${i}.png`;
    const fullpath = path.join(targetDir, filename);
    if (fs.existsSync(fullpath)) {
      filesToUpload.push({ num: i, filename, fullpath });
    }
  }

  console.log(`Found ${filesToUpload.length} files to upload to Google Drive.`);
  
  const urlMap = {};

  for (const item of filesToUpload) {
    try {
      console.log(`Uploading ${item.filename}...`);
      const fileId = await uploadFile(item.fullpath, item.filename, 'image/png');
      const gdriveUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
      urlMap[`/images/free-assets/asset_${item.num}.png`] = gdriveUrl;
      console.log(`Success: ${item.filename} -> ${gdriveUrl}`);
    } catch (err) {
      console.error(`Failed to upload ${item.filename}:`, err.message);
    }
  }

  // 3. Update route.ts to replace local URLs with Google Drive download URLs
  const routePath = path.join(__dirname, '../src/app/api/free-assets/list/route.ts');
  if (fs.existsSync(routePath)) {
    let routeContent = fs.readFileSync(routePath, 'utf8');
    
    // Replace mappings
    Object.keys(urlMap).forEach(localPath => {
      const gdriveUrl = urlMap[localPath];
      // Escape for regex/string match
      routeContent = routeContent.split(`"${localPath}"`).join(`"${gdriveUrl}"`);
    });

    fs.writeFileSync(routePath, routeContent, 'utf8');
    console.log("Updated route.ts static assets URLs to use Google Drive hosting!");
  }
}

run().catch(err => {
  console.error("Execution failed:", err);
});
