// Version history, read from the GitHub releases of the downloads repo.
(() => {
  const box = document.getElementById('releases');
  const cfg = window.STABLE_SITE;
  if (!box || !cfg) return;
  const esc = (t) => t.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const empty = () => { box.innerHTML = '<p class="muted">No versions have been released yet. The first alpha is coming soon.</p>'; };
  fetch(`https://api.github.com/repos/${cfg.repo}/releases`, { headers: { accept: 'application/vnd.github+json' } })
    .then((r) => (r.ok ? r.json() : []))
    .then((list) => {
      const rels = list.filter((r) => !r.draft);
      if (!rels.length) return empty();
      box.innerHTML = rels.map((r) => {
        const date = r.published_at ? new Date(r.published_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '';
        const notes = esc(r.body || '').trim() || 'No notes for this version.';
        return `<article class="release"><header><h3>${esc(r.tag_name.replace(/^v/, ''))}</h3><span class="muted">${date}${r.prerelease ? ' · alpha' : ''}</span></header><pre>${notes}</pre></article>`;
      }).join('');
    })
    .catch(empty);
})();
