/*
Set up each client below with a UNIQUE access code, album title and photo URLs.
DEMO ONLY: codes stored in browser JavaScript are not private; anyone can inspect this file.
For real confidential albums, use server-side authentication and protected storage rules.
*/
const CLIENT_ALBUMS = {
  "DEMO-ALBUM-01": { title: "Sample Client Album", subtitle: "Replace with client event details.", photos: [] },
  "DEMO-ALBUM-02": { title: "Sample Wedding Album", subtitle: "Each client has a separate access code.", photos: [] }
};
const $ = id => document.getElementById(id);
const loginView=$('loginView'), albumView=$('albumView'), form=$('albumLogin'), input=$('albumCode'), message=$('loginMessage');
const left=$('leftPage'), right=$('rightPage'), count=$('pageCount'), prev=$('prevPage'), next=$('nextPage');
let album=null, page=0;
function render(target, url, n) {
  target.replaceChildren();
  if (url) {
    const img=document.createElement('img'); img.src=url; img.alt='Album photograph '+(n+1); img.loading='lazy';
    img.onerror=()=>{target.textContent='Photo unavailable — check its URL in CLIENT_ALBUMS.';};
    target.appendChild(img);
  } else {
    const box=document.createElement('div'); box.className='page-placeholder';
    const title=document.createElement('strong'); title.textContent=n===0?'Your Story':'A Moment to Remember';
    const text=document.createElement('span'); text.textContent='Add this client’s photo URLs in client-gallery.js.';
    box.append(title,text); target.appendChild(box);
  }
}
function updateBook() {
  const photos=album.photos||[], total=Math.max(photos.length,2);
  render(left,photos[page]||'',page); render(right,photos[page+1]||'',page+1);
  count.textContent='Pages '+(page+1)+'–'+Math.min(page+2,total)+' / '+total;
  prev.disabled=page===0; next.disabled=page+2>=total;
}
form.addEventListener('submit',e=>{
  e.preventDefault();
  const found=CLIENT_ALBUMS[input.value.trim().toUpperCase()];
  if(!found){message.textContent='Code not found. Check it or contact SARITA PHOTO.';return;}
  album=found; page=0; $('albumTitle').textContent=found.title; $('albumSubtitle').textContent=found.subtitle||'A little book of forever.';
  message.textContent=''; loginView.style.display='none'; albumView.classList.add('active'); updateBook();
});
next.addEventListener('click',()=>{if(page+2<Math.max((album.photos||[]).length,2)){page+=2;updateBook();}});
prev.addEventListener('click',()=>{page=Math.max(0,page-2);updateBook();});
function signOut(){album=null;page=0;input.value='';albumView.classList.remove('active');loginView.style.display='block';message.textContent='';}
$('lockAlbum').addEventListener('click',signOut); $('signOut').addEventListener('click',signOut);
