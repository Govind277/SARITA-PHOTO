const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getStorage } = require("firebase-admin/storage");
const crypto = require("node:crypto");

initializeApp();
const db = getFirestore();

function hashCode(code) {
  return crypto.createHash("sha256").update(code.trim().toUpperCase(), "utf8").digest("hex");
}

// Firestore document: albumCodes/{sha256OfAccessCode}
// Fields: active (boolean), albumId (string), title (string), subtitle (string),
// photoPaths (array of Storage object paths under client-albums/{albumId}/...).
// Keep this collection writable only by trusted administrators.
exports.unlockPrivateAlbum = onCall({ enforceAppCheck: false, maxInstances: 10 }, async (request) => {
  const rawCode = request.data && request.data.code;
  if (typeof rawCode !== "string" || rawCode.trim().length < 10 || rawCode.trim().length > 100) {
    throw new HttpsError("invalid-argument", "Please enter the private album code shared by SARITA PHOTO.");
  }

  const codeHash = hashCode(rawCode);
  const ref = db.collection("albumCodes").doc(codeHash);
  const snap = await ref.get();

  if (!snap.exists || snap.data().active !== true) {
    // Keep the response generic so the endpoint doesn't reveal valid codes.
    throw new HttpsError("not-found", "Album code is invalid or expired.");
  }

  const data = snap.data();
  if (typeof data.albumId !== "string" || !Array.isArray(data.photoPaths) || data.photoPaths.length > 5000) {
    throw new HttpsError("failed-precondition", "This album is not configured correctly. Please contact SARITA PHOTO.");
  }

  const bucket = getStorage().bucket();
  const photos = await Promise.all(data.photoPaths.map(async (objectPath) => {
    if (typeof objectPath !== "string" || !objectPath.startsWith(`client-albums/${data.albumId}/`) || objectPath.includes("..")) {
      throw new HttpsError("failed-precondition", "An album photo path is invalid.");
    }
    const file = bucket.file(objectPath);
    const [exists] = await file.exists();
    if (!exists) return null;
    const [url] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + 15 * 60 * 1000
    });
    return url;
  }));

  return {
    title: typeof data.title === "string" ? data.title : "SARITA PHOTO E-Album",
    subtitle: typeof data.subtitle === "string" ? data.subtitle : "A little book of forever.",
    photos: photos.filter(Boolean)
  };
});

