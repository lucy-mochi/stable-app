// The two sliders on the home page: both use Stable's real logic with made-up example numbers.
(() => {
  const set = (el, v) => {
    const min = +el.dataset.min, max = +el.dataset.max, step = +el.dataset.step;
    v = Math.min(max, Math.max(min, Math.round(v / step) * step));
    el.dataset.val = v;
    el.setAttribute('aria-valuenow', v);
    el.querySelector('b').style.height = `${12 + ((v - min) / (max - min)) * 88}%`;
    return v;
  };
  const END = new Date(2026, 11, 31);
  const fmt = (d) => d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  const update = () => {
    const n = set(document.getElementById('s-notice'), +document.getElementById('s-notice').dataset.val);
    const r = set(document.getElementById('s-rate'), +document.getElementById('s-rate').dataset.val);
    const due = new Date(END); due.setDate(due.getDate() - n);
    document.getElementById('out-notice').textContent = fmt(due);
    document.getElementById('cap-notice').textContent = `${n} days → reminder`;
    document.getElementById('out-rate').textContent = `$${(92 * r / 100).toFixed(2).replace(/\.00$/, '')}`;
    document.getElementById('cap-rate').textContent = `${r}% for code 99213`;
  };
  document.querySelectorAll('.cap[role=slider]').forEach((el) => {
    const fromPointer = (e) => {
      const rect = el.getBoundingClientRect();
      const t = 1 - Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
      const min = +el.dataset.min, max = +el.dataset.max;
      el.dataset.val = min + t * (max - min);
      update();
    };
    el.addEventListener('pointerdown', (e) => { el.setPointerCapture(e.pointerId); fromPointer(e); el.onpointermove = fromPointer; });
    el.addEventListener('pointerup', () => { el.onpointermove = null; });
    el.addEventListener('keydown', (e) => {
      const d = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1 }[e.key];
      if (!d) return;
      e.preventDefault();
      el.dataset.val = +el.dataset.val + d * +el.dataset.step;
      update();
    });
  });
  update();
})();
