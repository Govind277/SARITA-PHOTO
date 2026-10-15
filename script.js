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
  // Installable mobile-app experience (PWA). Existing admin and album links remain untouched.
  const prompt = document.getElementById('appPrompt');
  const installButtons = [document.getElementById('installApp'), document.getElementById('installAppSecondary')].filter(Boolean);
  const dismiss = document.getElementById('dismissAppPrompt');
  let installEvent = null;
  const help = document.getElementById('installHelp');
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  if (prompt && isStandalone) prompt.hidden = true;
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
  if (dismiss && prompt) dismiss.addEventListener('click', () => { prompt.hidden = true; });
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
  }
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();