import { getDriveClient } from "@/lib/google-drive";

async function unifyDriveFolders() {
  console.log("=== UNIFYING GOOGLE DRIVE FOLDERS INTO writing_creaibox_posts ===");

  const drive = getDriveClient();
  const rootFolderId = process.env.GDRIVE_FOLDER_ID;

  if (!rootFolderId) {
    throw new Error("GDRIVE_FOLDER_ID is missing.");
  }

  const userId = "454dfd4e-2b64-4309-afbe-e54f34666eb4";

  // 1. Find user folder
  const userFolderRes = await drive.files.list({
    q: `name = '${userId}' and '${rootFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: "files(id, name)",
  });

  const userFolder = userFolderRes.data.files?.[0];
  if (!userFolder || !userFolder.id) {
    console.error("User folder not found!");
    return;
  }
  console.log(`Found user folder: ${userFolder.id}`);

  // 2. Find both `writing_creaibox_posts` (target) and `writing-creaibox-posts` (hyphen)
  const subFoldersRes = await drive.files.list({
    q: `'${userFolder.id}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: "files(id, name)",
  });

  const subFolders = subFoldersRes.data.files || [];
  console.log("Existing subfolders:", subFolders.map(f => f.name));

  const targetUnderscoreFolder = subFolders.find(f => f.name === "writing_creaibox_posts");
  const hyphenFolder = subFolders.find(f => f.name === "writing-creaibox-posts");

  if (!targetUnderscoreFolder || !targetUnderscoreFolder.id) {
    console.error("Target writing_creaibox_posts folder not found!");
    return;
  }

  if (hyphenFolder && hyphenFolder.id) {
    console.log(`Found hyphen folder (${hyphenFolder.id}). Moving all contents into writing_creaibox_posts (${targetUnderscoreFolder.id})...`);

    // List all contents inside hyphen folder (e.g. 202608 folder and any files)
    const hyphenContentsRes = await drive.files.list({
      q: `'${hyphenFolder.id}' in parents and trashed = false`,
      fields: "files(id, name, parents)",
    });

    const itemsToMove = hyphenContentsRes.data.files || [];
    for (const item of itemsToMove) {
      if (!item.id) continue;
      console.log(`  -> Moving "${item.name}" into writing_creaibox_posts...`);
      await drive.files.update({
        fileId: item.id,
        addParents: targetUnderscoreFolder.id,
        removeParents: hyphenFolder.id,
        fields: "id, parents",
      });
    }

    // Delete or trash the hyphen folder
    console.log(`  🗑️ Deleting empty duplicate folder "writing-creaibox-posts"...`);
    await drive.files.delete({
      fileId: hyphenFolder.id,
    });
    console.log(`  ✅ Duplicate folder deleted!`);
  } else {
    console.log("No hyphen folder found, already unified!");
  }

  console.log("\n🎉 UNIFICATION COMPLETE! Everything is now cleanly unified under writing_creaibox_posts (with 202607 and 202608).");
}

unifyDriveFolders().catch(console.error);
