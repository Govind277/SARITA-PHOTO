(() => {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      toggle.textContent = open ? '✕' : '☰';
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation');
      toggle.textContent = '☰';
    }));
  }
  const mainVideo = document.getElementById('mainVideo');
  const modal = document.getElementById('videoModal');
  const modalVideo = document.getElementById('modalVideo');
  const openModal = document.getElementById('openModal');
  const closeModal = document.getElementById('closeModal');
  const thumbs = document.querySelectorAll('.thumb');
  const showModal = () => {
    if (!modal || !modalVideo) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    const source = mainVideo && mainVideo.querySelector('source');
    if (source && modalVideo.querySelector('source')) modalVideo.querySelector('source').src = source.src;
    modalVideo.load();
    modalVideo.play().catch(() => {});
  };
  const hideModal = () => {
    if (!modal || !modalVideo) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    modalVideo.pause();
  };
  if (openModal) openModal.addEventListener('click', showModal);
  if (closeModal) closeModal.addEventListener('click', hideModal);
  if (modal) modal.addEventListener('click', e => { if (e.target === modal) hideModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') hideModal(); });
  thumbs.forEach(thumb => thumb.addEventListener('click', () => {
    if (!mainVideo) return;
    const source = mainVideo.querySelector('source');
    if (source && thumb.dataset.video) source.src = thumb.dataset.video;
    if (thumb.dataset.poster) mainVideo.poster = thumb.dataset.poster;
    mainVideo.load();
    mainVideo.play().catch(() => {});
    thumbs.forEach(item => item.classList.toggle('active', item === thumb));
  }));
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();