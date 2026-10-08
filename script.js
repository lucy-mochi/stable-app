// Download links (built from config.js), your system highlighted, and the latest version number.
(() => {
  const cfg = window.STABLE_SITE;
  if (!cfg) return;
  const releases = `https://github.com/${cfg.repo}/releases`;
  const latest = `${releases}/latest/download/`;

  // Until the first release is published the download buttons say "Coming soon" instead of linking nowhere.
  const links = [...document.querySelectorAll('[data-file]')];
  links.forEach((a) => {
    a.dataset.label = a.textContent;
    a.textContent = 'Coming soon';
    a.setAttribute('aria-disabled', 'true');
    a.classList.add('is-disabled');
    a.addEventListener('click', (e) => a.getAttribute('aria-disabled') === 'true' && e.preventDefault());
  });
  const enable = () =>
    links.forEach((a) => {
      const file = cfg.files[a.dataset.file];
      if (!file) return;
      a.href = latest + file;
      a.textContent = a.dataset.label;
      a.removeAttribute('aria-disabled');
      a.classList.remove('is-disabled');
    });
  document.querySelectorAll('a[href="releases-link"]').forEach((a) => (a.href = releases));

  const ua = navigator.userAgent;
  const os = /Mac/i.test(ua) && !/iPhone|iPad/i.test(ua) ? 'mac' : /Win/i.test(ua) ? 'win' : /Linux/i.test(ua) && !/Android/i.test(ua) ? 'linux' : null;
  if (os) {
    document.querySelector(`.dl[data-os="${os}"]`)?.classList.add('mine');
    const names = { mac: 'Mac', win: 'Windows', linux: 'Linux' };
    document.querySelectorAll('[data-os-cta]').forEach((a) => (a.textContent = `Download for ${names[os]}`));
  }

  fetch(`https://api.github.com/repos/${cfg.repo}/releases/latest`, { headers: { accept: 'application/vnd.github+json' } })
    .then((r) => (r.ok ? r.json() : null))
    .then((rel) => {
      if (!rel?.tag_name) return;
      enable();
      const el = document.getElementById('version');
      if (!el) return;
      const date = rel.published_at ? new Date(rel.published_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : '';
      el.textContent = `Latest version ${rel.tag_name.replace(/^v/, '')}${date ? `, released ${date}` : ''}`;
      el.hidden = false;
    })
    .catch(() => undefined);
})();
