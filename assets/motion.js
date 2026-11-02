(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const formatCount = value => Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const counters = document.querySelectorAll('[data-counter]');

  function count(element, animate) {
    const target = Number(element.dataset.counter);
    if (!Number.isFinite(target)) return;
    const prefix = element.dataset.prefix || '';
    const suffix = element.dataset.suffix || '';
    const display = value => { element.textContent = `${prefix}${formatCount(value)}${suffix}`; };
    if (!animate) {
      display(target);
      return;
    }
    const start = performance.now();
    function frame(time) {
      const progress = Math.min(1, (time - start) / 1100);
      display(target * (1 - Math.pow(1 - progress, 3)));
      if (progress < 1 && !reducedMotion.matches) requestAnimationFrame(frame);
      else display(target);
    }
    requestAnimationFrame(frame);
  }

  if (reducedMotion.matches || !('IntersectionObserver' in window)) {
    counters.forEach(element => count(element, false));
    return;
  }

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      entry.target.classList.remove('reveal-pending');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('[data-reveal]').forEach(element => {
    element.classList.add('reveal-pending');
    revealObserver.observe(element);
  });

  const countObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      count(entry.target, true);
      countObserver.unobserve(entry.target);
    });
  }, { threshold: 0.3 });
  counters.forEach(element => countObserver.observe(element));

  const printObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const lines = entry.target.querySelectorAll('.ticket-line, [data-print-line]');
      lines.forEach((line, index) => {
        window.setTimeout(() => {
          line.classList.add('is-printed');
          line.classList.remove('print-pending');
        }, reducedMotion.matches ? 0 : index * 110);
      });
      printObserver.unobserve(entry.target);
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('[data-print]').forEach(element => {
    element.querySelectorAll('.ticket-line, [data-print-line]').forEach(line => line.classList.add('print-pending'));
    printObserver.observe(element);
  });

  reducedMotion.addEventListener('change', event => {
    if (!event.matches) return;
    document.querySelectorAll('.reveal-pending, .print-pending').forEach(element => {
      element.classList.remove('reveal-pending', 'print-pending');
    });
    counters.forEach(element => count(element, false));
  });
})();
