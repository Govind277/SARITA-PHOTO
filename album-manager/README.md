# SARITA PHOTO — Private Client Album Manager

A separate Apps Script app; it does not modify the existing Google Drive Gallery Admin or E-Album Create Admin.

## Setup
1. Open https://script.google.com and create a **new standalone Apps Script project**.
2. Replace `Code.gs` with `Code.gs` in this folder. Add HTML files named exactly `Admin` and `Client` and paste the matching HTML file contents (Apps Script file names omit the .html suffix).
3. Run `setupAlbumManager()` from the editor and authorize it. This creates a separate private spreadsheet.
4. Project Settings → Script properties: add `ALBUM_MANAGER_ADMIN_PASSWORD` with a strong unique password of at least 12 characters. Never put it in GitHub or share it.
5. Deploy → New deployment → Web app; execute as **Me** and access **Anyone**. The app itself checks the admin password and validates client access. Copy the deployment URL.
6. Admin URL is the deployment URL; client login URL is the same URL plus `?page=client`.

## Use
In Admin, sign in, enter client name, 10-digit mobile and ready link such as `https://view.ealbum.in/?c=73007922M9`, then create code. Copy the code immediately and share it privately. Codes are stored as SHA-256 hashes and cannot be viewed again. Disable/re-enable client access in the list.

**Privacy limitation:** This gate controls access through the new login page. It cannot revoke or protect the underlying eAlbum provider URL if someone separately shares that URL. Check the provider's own sharing controls if strict privacy is required.
