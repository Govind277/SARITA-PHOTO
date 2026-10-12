/* SARITA PHOTO Photo Selection — demo client-side implementation.
   IMPORTANT: access codes and selections are browser-side only, not secure authentication.
   Replace the demo gallery with a protected backend before using real client photos. */
(() => {
  const DEMO_CODE = 'SARITA-DEMO-2026';
  const photos = [
    {id:'SP001',event:'Wedding',title:'The Celebration',url:'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=85'},
    {id:'SP002',event:'Portraits',title:'Together',url:'https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=900&q=85'},
    {id:'SP003',event:'Details',title:'The Details',url:'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=85'},
    {id:'SP004',event:'Wedding',title:'The Ceremony',url:'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=900&q=85'},
    {id:'SP005',event:'Portraits',title:'Golden Hour',url:'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=900&q=85'},
    {id:'SP006',event:'Details',title:'Little Moments',url:'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=85'},
    {id:'SP007',event:'Wedding',title:'The Joy',url:'https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?auto=format&fit=crop&w=900&q=85'},
    {id:'SP008',event:'Portraits',title:'Just Us',url:'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=85'},
    {id:'SP009',event:'Details',title:'Forever Begins',url:'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=900&q=85'}
  ];
  const $ = id => document.getElementById(id);
  const login = $('selectionLogin'), workspace = $('selectionWorkspace'), form = $('selectionLoginForm');
  const status = $('selectionStatus'), grid = $('photoGrid'), count = $('selectionCount');
  let selected = new Set(), filter = 'All';
  const storageKey = 'sarita-photo-demo-selection-v1';
  try { selected = new Set(JSON.parse(localStorage.getItem(storageKey) || '[]')); } catch (_) {}
  function save(){ try { localStorage.setItem(storageKey, JSON.stringify([...selected])); } catch (_) {} }
  function render(){
    grid.replaceChildren();
    photos.filter(p => filter === 'All' || p.event === filter).forEach(p => {
      const card = document.createElement('article'); card.className = 'selection-card' + (selected.has(p.id) ? ' selected' : '');
      const img = document.createElement('img'); img.src = p.url; img.alt = p.title; img.loading = 'lazy';
      const meta = document.createElement('div'); meta.className = 'photo-meta';
      const title = document.createElement('div'); const strong = document.createElement('strong'); strong.textContent = p.title;
      const small = document.createElement('small'); small.textContent = p.id + ' · ' + p.event; title.append(strong,small);
      const label = document.createElement('label'); const cb = document.createElement('input'); cb.type='checkbox'; cb.checked=selected.has(p.id); cb.setAttribute('aria-label','Select '+p.title);
      cb.addEventListener('change',()=>{if(cb.checked)selected.add(p.id);else selected.delete(p.id);save();render();});
      label.append(cb,document.createTextNode(' Pick')); meta.append(title,label); card.append(img,meta); grid.append(card);
    });
    count.textContent = selected.size + ' photo' + (selected.size===1?'':'s') + ' selected';
    document.querySelectorAll('[data-filter]').forEach(b=>b.classList.toggle('active',b.dataset.filter===filter));
  }
  form.addEventListener('submit',e=>{e.preventDefault(); if($('selectionCode').value.trim().toUpperCase()!==DEMO_CODE){status.textContent='That code was not recognised. Please check it or contact the studio.';return;}status.textContent='';login.style.display='none';workspace.style.display='block';render();});
  document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;render();}));
  $('clearSelection').addEventListener('click',()=>{selected.clear();save();render();});
  $('exportSelection').addEventListener('click',()=>{
    const rows=[['Photo ID','Title','Event','Image URL'],...photos.filter(p=>selected.has(p.id)).map(p=>[p.id,p.title,p.event,p.url])];
    const quote=v=>'"'+String(v).replace(/"/g,'""')+'"';
    const note=$('clientNote').value.trim();
    rows.push([],['Client note',note]);
    const blob=new Blob(['\ufeff'+rows.map(row=>row.map(quote).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8;'});
    const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='SARITA-PHOTO-selected-photos.csv';document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
  });
  $('selectionLogout').addEventListener('click',()=>{workspace.style.display='none';login.style.display='block';$('selectionCode').value='';status.textContent='Gallery locked.';});
})();