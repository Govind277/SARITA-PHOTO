# SARITA PHOTO — Photo & Video Manager

This is a separate media-manager Apps Script source. Do not replace the existing Wedding E-Album / Client Gallery Apps Script with this code.

## Update the media-manager Apps Script

1. Open the separate Apps Script project whose web-app URL is used for the public media feed (the URL ending in /exec and supporting ?action=gallery).
2. Replace its Code.gs with Code.gs from this folder.
3. In Apps Script, create/replace an HTML file named exactly Index and paste the contents of Index.html.
4. Open Project Settings → Script Properties. Keep the existing MEDIA_FOLDER_ID and MEDIA_INDEX_V1 values. Confirm MEDIA_FOLDER_ID contains the ID of the dedicated photo/video folder.
5. Add a new property named MEDIA_ADMIN_KEY. Set its value to a long, private secret of your choice. Do not share it in the website or in chat.
6. Save the project. Under Deploy → Manage deployments → Edit, select New version and deploy the existing web app as Execute as: Me and Who has access: Anyone. The public website only reads published media; write actions require the private admin key.
7. Open the same media-manager web-app URL. Enter the private key, upload an image/video (up to 20 MB each), and press Publish to show it on the main website. Unpublished uploads are not shown publicly.

## Important

- Keep the existing Wedding E-Album, Client E-Album, Album Admin, their URLs, and their script properties untouched.
- Only upload client-approved photos/videos. Publishing makes the file viewable to anyone with the link; unpublishing attempts to revert it to private access.
- Supported formats: JPG, PNG, WEBP, GIF, MP4, WEBM, MOV.
- Large videos over 20 MB must be compressed before upload.
