const MEDIA_FOLDER_KEY = "MEDIA_FOLDER_ID";
const ADMIN_KEY_PROPERTY = "MEDIA_ADMIN_KEY";
const INDEX_KEY = "MEDIA_INDEX_V1";
const MAX_FILE_BYTES = 20 * 1024 * 1024; // 20 MB per file

function doGet(e) {
  if (e && e.parameter && e.parameter.action === "gallery") return publicGallery_(e);
  return HtmlService.createHtmlOutputFromFile("Index")
    .setTitle("SARITA PHOTO — Photo & Video Manager")
    .addMetaTag("viewport", "width=device-width, initial-scale=1");
}

function assertAdminKey_(key) {
  const saved = PropertiesService.getScriptProperties().getProperty(ADMIN_KEY_PROPERTY);
  if (!saved) throw new Error("Admin setup pending: Script Properties mein MEDIA_ADMIN_KEY set karein.");
  if (!key || String(key) !== saved) throw new Error("Admin key galat hai.");
}

function mediaFolder_() {
  const id = PropertiesService.getScriptProperties().getProperty(MEDIA_FOLDER_KEY);
  if (!id) throw new Error("MEDIA_FOLDER_ID set nahi hai. Script Properties mein Drive folder ID set karein.");
  return DriveApp.getFolderById(id);
}

function listMedia(key) {
  assertAdminKey_(key);
  return readMedia_().sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
}

function uploadMedia(payload, key) {
  assertAdminKey_(key);
  if (!payload || !payload.name || !payload.mimeType || !payload.base64) throw new Error("File details missing.");
  const bytes = Utilities.base64Decode(String(payload.base64));
  if (!bytes.length) throw new Error("File empty hai.");
  if (bytes.length > MAX_FILE_BYTES) throw new Error("File 20 MB se badi hai. Chhoti/compressed file upload karein.");
  const mimeType = String(payload.mimeType);
  if (!/^(image\/(jpeg|png|webp|gif)|video\/(mp4|webm|quicktime|3gpp))$/i.test(mimeType)) {
    throw new Error("Sirf JPG, PNG, WEBP, GIF, MP4, WEBM ya MOV file upload karein.");
  }
  const safeName = cleanName_(payload.name);
  const blob = Utilities.newBlob(bytes, mimeType, safeName);
  const file = mediaFolder_().createFile(blob);
  const id = file.getId();
  const item = {
    id: id,
    name: safeName,
    mimeType: mimeType,
    size: bytes.length,
    createdAt: new Date().toISOString(),
    published: false,
    caption: String(payload.caption || "").trim().slice(0, 180),
    url: "https://drive.google.com/uc?export=view&id=" + id,
    thumbnailUrl: "https://drive.google.com/thumbnail?id=" + id + "&sz=w1200",
    previewUrl: "https://drive.google.com/file/d/" + id + "/preview"
  };
  const all = readMedia_();
  all.push(item);
  saveMedia_(all);
  return { ok: true, item: item };
}

function setMediaPublished(id, published, caption, key) {
  assertAdminKey_(key);
  id = String(id || "");
  const all = readMedia_();
  const item = all.find(x => x.id === id);
  if (!item) throw new Error("Media record nahi mila.");
  const file = DriveApp.getFileById(id);
  if (!hasParent_(file, mediaFolder_().getId())) throw new Error("Safety check failed: file media folder mein nahi hai.");
  item.published = published === true;
  if (caption !== undefined) item.caption = String(caption || "").trim().slice(0, 180);
  if (item.published) {
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  } else {
    file.setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.NONE);
  }
  saveMedia_(all);
  return { ok: true };
}

function deleteMedia(id, key) {
  assertAdminKey_(key);
  id = String(id || "");
  const all = readMedia_();
  const item = all.find(x => x.id === id);
  if (!item) throw new Error("Media record nahi mila.");
  const file = DriveApp.getFileById(id);
  if (!hasParent_(file, mediaFolder_().getId())) throw new Error("Safety check failed: file media folder mein nahi hai.");
  file.setTrashed(true);
  saveMedia_(all.filter(x => x.id !== id));
  return { ok: true };
}

function publicGallery_(e) {
  const callback = String(e.parameter.callback || "");
  if (!/^[A-Za-z_$][0-9A-Za-z_$.[\]]{0,100}$/.test(callback)) {
    return ContentService.createTextOutput("Invalid callback");
  }
  const items = readMedia_().filter(x => x.published === true).map(x => ({
    id: x.id,
    name: x.name,
    mimeType: x.mimeType,
    caption: x.caption || "",
    thumbnailUrl: x.thumbnailUrl,
    previewUrl: x.previewUrl,
    url: x.url
  }));
  return ContentService.createTextOutput(callback + "(" + JSON.stringify({ ok: true, items: items }) + ");")
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function readMedia_() {
  const raw = PropertiesService.getScriptProperties().getProperty(INDEX_KEY) || "[]";
  const items = JSON.parse(raw);
  if (!Array.isArray(items)) throw new Error("Media index format galat hai.");
  return items;
}
function saveMedia_(items) {
  PropertiesService.getScriptProperties().setProperty(INDEX_KEY, JSON.stringify(items));
}
function hasParent_(file, folderId) {
  const parents = file.getParents();
  while (parents.hasNext()) if (parents.next().getId() === folderId) return true;
  return false;
}
function cleanName_(name) {
  return String(name || "media").replace(/[\\/:*?"<>|]/g, "_").trim().slice(0, 180) || "media";
}