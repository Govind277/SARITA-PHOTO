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
  // Premium welcome popup on app/site launch; close or explore to continue.
  const welcome = document.getElementById('welcomeModal');
  const welcomeClose = document.getElementById('welcomeClose');
  const welcomeBackdrop = document.getElementById('welcomeBackdrop');
  const welcomeExplore = document.getElementById('welcomeExplore');
  const closeWelcome = () => {
    if (welcome) welcome.hidden = true;
    document.body.classList.remove('welcome-open');
  };
  if (welcome) {
    let alreadyWelcomed = false;
    try { alreadyWelcomed = sessionStorage.getItem('sarita-photo-welcomed') === '1'; } catch (_) {}
    if (alreadyWelcomed) welcome.hidden = true;
    else {
      welcome.hidden = false;
      try { sessionStorage.setItem('sarita-photo-welcomed', '1'); } catch (_) {}
      document.body.classList.add('welcome-open');
    }
    if (welcomeClose) welcomeClose.addEventListener('click', closeWelcome);
    if (welcomeBackdrop) welcomeBackdrop.addEventListener('click', closeWelcome);
    if (welcomeExplore) welcomeExplore.addEventListener('click', () => {
      closeWelcome();
      document.getElementById('about')?.scrollIntoView({behavior:'smooth'});
    });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeWelcome(); });
  }

  // Booking form opens a pre-filled WhatsApp enquiry; the client must press Send.
  const bookingForm = document.getElementById('bookingForm');
  const dateField = document.getElementById('bookingDate');
  if (dateField) { const d = new Date(); dateField.min = [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-'); }
  if (bookingForm) bookingForm.addEventListener('submit', event => {
    event.preventDefault(); if (!bookingForm.reportValidity()) return;
    const data = new FormData(bookingForm);
    const message = ['Namaste SARITA PHOTO, mujhe photography booking ki jaankari chahiye.','','Name: '+data.get('name'),'Phone: '+data.get('phone'),'Event: '+data.get('event'),'Event date: '+data.get('date'),'Venue / City: '+(data.get('venue')||'Not specified'),'Details: '+(data.get('message')||'Not specified')].join('\n');
    window.open('https://wa.me/919314711514?text='+encodeURIComponent(message),'_blank','noopener,noreferrer');
  });
  // Keep the studio-approved hero image defined in style.css; do not replace it with stock slides.

  // Installable mobile-app experience (PWA). Existing admin and album links remain untouched.
  const prompt = document.getElementById('appPrompt');
  const installButtons = [document.getElementById('installApp'), document.getElementById('installAppSecondary')].filter(Boolean);
  const dismiss = document.getElementById('dismissAppPrompt');
  let installEvent = null;
  const help = document.getElementById('installHelp');
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  if (prompt && isStandalone) prompt.hidden = true;
  try { if (prompt && sessionStorage.getItem('sarita-install-prompt-dismissed') === '1') prompt.hidden = true; } catch (_) {}
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    installEvent = event;
    installButtons.forEach(button => { button.textContent = 'Install App'; button.disabled = false; });
  });
  installButtons.forEach(button => button.addEventListener('click', async () => {
    if (installEvent) {
      installEvent.prompt();
      await installEvent.userChoice;
      installEvent = null;
    } else if (help) {
      help.classList.toggle('install-help-open');
      help.scrollIntoView({behavior:'smooth',block:'nearest'});
    }
  }));
  if (dismiss && prompt) dismiss.addEventListener('click', () => {
    prompt.hidden = true;
    try { sessionStorage.setItem('sarita-install-prompt-dismissed', '1'); } catch (_) {}
  });
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
  }
  // Subtle scroll-reveal animations; content stays visible if observers are unsupported.
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealTargets = '.service-card, .gallery-item, .process-steps article, .review-card, .gallery-promise-card';
  let revealObserver = null;
  const revealWithin = (root) => {
    if (!root || reduceMotion || !('IntersectionObserver' in window)) return;
    const nodes = [];
    if (root.matches && root.matches(revealTargets)) nodes.push(root);
    if (root.querySelectorAll) nodes.push(...root.querySelectorAll(revealTargets));
    nodes.forEach(node => {
      if (node.classList.contains('scroll-reveal')) return;
      node.classList.add('scroll-reveal');
      revealObserver.observe(node);
    });
  };
  if (!reduceMotion && 'IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {threshold:0.12,rootMargin:'0px 0px -24px 0px'});
    revealWithin(document);
    const mediaGrid = document.getElementById('liveMediaGrid');
    if (mediaGrid && 'MutationObserver' in window) {
      new MutationObserver(() => revealWithin(mediaGrid)).observe(mediaGrid,{childList:true});
    }
  }
  // Back-to-top appears only after the visitor has scrolled.
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    const updateBackToTop = () => backToTop.classList.toggle('is-visible', window.scrollY > 500);
    window.addEventListener('scroll', updateBackToTop, {passive:true});
    updateBackToTop();
    backToTop.addEventListener('click', () => window.scrollTo({top:0,behavior:reduceMotion?'auto':'smooth'}));
  }
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();