# SARITA PHOTO — Private E-Album Setup

The existing red/ivory Flipbook layout stays on GitHub Pages. Original wedding photos stay in a **private Firebase Storage bucket**; the browser does not contain album codes or original photo URLs.

## Important
The code files in this repository are only the integration scaffold until the Firebase project is configured and deployed. Do not upload client photos yet and do not share live album codes until the setup and security tests are complete.

## 1. Create a dedicated Firebase project
Use a project for SARITA PHOTO (do not reuse another unrelated site's Firebase project). Enable Cloud Storage and Cloud Firestore. Enable billing if Firebase requires it for the selected bucket/Cloud Functions deployment.

## 2. Configure the website
Register a Firebase Web App and copy its config into `firebase-config.js`. This file uses public client identifiers only; never place a service-account JSON, private key, or Admin SDK credentials in the website repository.

## 3. Install/deploy Cloud Functions
From a local working copy of this repository:
- Install Firebase CLI and run `firebase login`.
- Run `firebase init functions firestore storage` and select the dedicated SARITA PHOTO project.
- Copy `functions/index.js` and `functions/package.json` from this repository into the initialized Functions directory.
- Deploy with `firebase deploy --only functions,storage`.

Do not deploy until Storage Rules are set to deny direct browser access and tested.

## 4. Store original photographs
Upload optimized JPG/WebP files to Firebase Storage under paths like:
`client-albums/2026-10-CLIENT-001/001.jpg`
`client-albums/2026-10-CLIENT-001/002.jpg`

Keep the bucket private. Never set these folders to public access.

## 5. Register each album
Create a Firestore collection named `albumCodes`. For each album, create a document whose ID is the SHA-256 hash of the uppercase trimmed access code. The document fields:
- `active`: `true`
- `albumId`: the folder ID (for example `2026-10-CLIENT-001`)
- `title`: display title
- `subtitle`: optional subtitle
- `photoPaths`: array of exact Storage object paths, in flipbook order

Use a long random code (at least 16 characters), not a client's phone number or wedding date. Calculate the SHA-256 document ID locally; do not store the plain-text code in Firestore. Only trusted admins should have Firestore write access to `albumCodes`.

## 6. Security requirements
- Keep Storage and Firestore locked to public browser reads/writes.
- Do not store plain access codes or photo URLs in JavaScript.
- The Cloud Function returns temporary signed URLs that expire after 15 minutes. A recipient could still copy a signed URL during that window, so treat it as temporary access rather than DRM.
- Add request throttling/abuse monitoring before production; a client-side code field alone is not rate limiting.
- Test valid, invalid, disabled and expired/revoked codes; test direct Storage URL access and ensure it is denied.

## 7. Current status
This repository scaffold does not automatically configure a Firebase project, upload photos, create Firestore album documents, or deploy functions. Those steps require access to the SARITA PHOTO Firebase project and must be completed before private albums work end-to-end.

