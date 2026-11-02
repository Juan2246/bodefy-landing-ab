(() => {
  'use strict';
  const comparison = document.querySelector('.comparison');
  const buttons = document.querySelectorAll('[data-view]');
  let mode = 'desktop';

  function resize() {
    document.querySelectorAll('.iframe-shell').forEach(shell => {
      const stage = shell.parentElement;
      const style = getComputedStyle(stage);
      const available = stage.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      const viewport = mode === 'mobile' ? 390 : 1280;
      const border = mode === 'mobile' ? 10 : 2;
      const scale = Math.min(1, (available - border) / viewport);
      shell.style.width = `${viewport * scale + border}px`;
      const iframe = shell.querySelector('iframe');
      iframe.style.width = `${viewport}px`;
      iframe.style.height = `${shell.clientHeight / scale}px`;
      iframe.style.transform = `scale(${scale})`;
    });
  }

  buttons.forEach(button => button.addEventListener('click', () => {
    mode = button.dataset.view;
    comparison.dataset.mode = mode;
    buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    document.getElementById('view-status').textContent = mode === 'mobile'
      ? 'Vista de celular · 390 px, ajustada al panel. Puedes navegar dentro de cada página.'
      : 'Vista de escritorio · 1280 px, ajustada al panel. Puedes navegar dentro de cada página.';
    resize();
  }));
  comparison.dataset.mode = mode;
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(comparison);
  else window.addEventListener('resize', resize);
  resize();
})();
