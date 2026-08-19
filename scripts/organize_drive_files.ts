import { getDriveClient, getOrCreateFolder } from "@/lib/google-drive";

async function organizeDriveFiles() {
  console.log("=== ORGANIZING GOOGLE DRIVE MIGRATED FILES INTO USER FOLDERS ===");

  const drive = getDriveClient();
  const rootFolderId = process.env.GDRIVE_FOLDER_ID;

  if (!rootFolderId) {
    throw new Error("GDRIVE_FOLDER_ID is missing.");
  }

  const userId = "454dfd4e-2b64-4309-afbe-e54f34666eb4";
  const sourceType = "writing-creaibox-posts";

  // 1. Get or create target directory: root / userId / writing-creaibox-posts / 202608
  const userFolderId = await getOrCreateFolder(drive, userId, rootFolderId);
  const sourceTypeFolderId = await getOrCreateFolder(drive, sourceType, userFolderId);
  const targetFolderId = await getOrCreateFolder(drive, "202608", sourceTypeFolderId);

  console.log(`Target destination folder created/found: ${targetFolderId}`);

  // 2. Find all migrated-sotongcheum- files in root folder
  let pageToken: string | undefined = undefined;
  let movedCount = 0;

  do {
    const listRes: any = await drive.files.list({
      q: `'${rootFolderId}' in parents and name contains 'migrated-sotongcheum-' and trashed = false`,
      fields: "nextPageToken, files(id, name, parents)",
      pageSize: 100,
      pageToken,
    });

    const files = listRes.data.files || [];
    console.log(`Found ${files.length} files in root folder to move.`);

    for (const file of files) {
      if (!file.id) continue;
      const currentParents = (file.parents || []).join(",");
      await drive.files.update({
        fileId: file.id,
        addParents: targetFolderId,
        removeParents: currentParents,
        fields: "id, parents",
      });
      movedCount++;
      console.log(`  -> Moved "${file.name}" to user folder!`);
    }

    pageToken = listRes.data.nextPageToken || undefined;
  } while (pageToken);

  console.log(`\n🎉 DONE! Successfully moved ${movedCount} files into user directory: /${userId}/${sourceType}/202608/`);
}

organizeDriveFiles().catch(console.error);
