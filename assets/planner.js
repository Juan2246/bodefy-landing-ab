(() => {
  'use strict';

  const form = document.getElementById('planner-form');
  if (!form) return;

  const variant = document.body.dataset.variant === 'b' ? 'b' : 'a';
  const products = [
    { id: 'arroz', name: 'Arroz', unit: 'kg', plural: 'kg', price: 450, quantity: 2, icon: '<path d="M8 3h8l-1 4 3 4v10H6V11l3-4-1-4Z"/><path d="M9 14h6m-5 3h4M9 7h6"/>' },
    { id: 'aceite', name: 'Aceite', unit: 'botella de 1 L', plural: 'botellas de 1 L', price: 850, quantity: 1, icon: '<path d="M10 3h4v4l3 4v10H7V11l3-4V3Z"/><path d="M10 6h4M7 13h10m-7 4h4"/>' },
    { id: 'leche', name: 'Leche', unit: 'unidad', plural: 'unidades', price: 400, quantity: 2, icon: '<path d="M8 3h8l3 5v13H5V8l3-5Z"/><path d="M8 3v5h11M5 8l3-5m8 0-3 5v13"/><path d="M8 13h2m-2 4h2"/>' },
    { id: 'huevos', name: 'Huevos', unit: 'docena', plural: 'docenas', price: 1000, quantity: 1, icon: '<path d="M7 4c-2 0-4 5-4 8a4 4 0 0 0 8 0c0-3-2-8-4-8Z"/><path d="M16 5c-2 0-4 5-4 8a4 4 0 0 0 8 0c0-3-2-8-4-8ZM3 19h18"/>' },
    { id: 'azucar', name: 'Azúcar', unit: 'kg', plural: 'kg', price: 400, quantity: 1, icon: '<path d="M7 3h10l-1 5 3 4v9H5v-9l3-4-1-5Z"/><path d="M8 8h8m-6 5 4 2-2 4-4-2 2-4Z"/>' }
  ];
  const state = { budget: 60, quantities: products.map(product => product.quantity) };
  const districtNames = Array.from(form.elements.district.options).map(option => option.value).filter(Boolean);
  const money = cents => `S/ ${(cents / 100).toFixed(2)}`;
  const icon = product => `<svg class="product-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${product.icon}</svg>`;
  const total = () => products.reduce((sum, product, index) => sum + product.price * state.quantities[index], 0);
  const balance = () => state.budget * 100 - total();
  let lead = null;
  let returnFocus = null;
  let storageAvailable = true;

  function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  }

  function quantityControl(product, index, scope) {
    return `<div class="quantity-control" role="group" aria-label="Cantidad de ${product.name}">
      <button type="button" data-quantity="${index}" data-step="-1" aria-label="Quitar una unidad de ${product.name}"><span aria-hidden="true">−</span></button>
      <output id="${scope}-quantity-${index}" class="quantity-value" aria-label="Cantidad de ${product.name}">${state.quantities[index]}</output>
      <button type="button" data-quantity="${index}" data-step="1" aria-label="Agregar una unidad de ${product.name}"><span aria-hidden="true">+</span></button>
    </div>`;
  }

  function createDialogs() {
    const host = document.createElement('div');
    host.innerHTML = `<dialog class="modal" id="privacy-modal" aria-labelledby="privacy-title">
      <div class="modal-inner">
        <div class="modal-header"><h2 id="privacy-title">Tu privacidad, primero.</h2><button class="modal-close" type="button" data-close-dialog aria-label="Cerrar política de privacidad">×</button></div>
        <p>Este sitio es un prototipo académico de Bodefy para el curso Technical Sales &amp; Marketing de la UPC.</p>
        <p>Con tu autorización, guardamos tu nombre, correo, distrito, lista, fecha y versión de la página solo en este navegador. No enviamos estos datos a servidores ni a bodegas.</p>
        <p>Usamos esta información para mostrar y descargar tu planificador. Puedes eliminarla borrando los datos de este sitio en tu navegador. Este prototipo no procesa compras ni envía cotizaciones reales.</p>
        <p class="fine-print">Precios referenciales; cada bodega confirma sus ofertas.</p>
        <div class="modal-actions"><button class="button" type="button" data-close-dialog>Entendido</button></div>
      </div>
    </dialog>
    <dialog class="modal planner-modal" id="planner-modal" aria-labelledby="planner-title" aria-describedby="planner-greeting">
      <div class="modal-inner">
        <div class="modal-header"><div><p class="eyebrow">Tu semana, más organizada</p><h2 id="planner-title" tabindex="-1">¡Tu lista está lista!</h2></div><button class="modal-close" type="button" data-close-dialog aria-label="Cerrar mi lista">×</button></div>
        <p class="modal-intro" id="planner-greeting"></p>
        <div class="budget-control"><label for="planner-budget">Presupuesto semanal</label><output id="planner-budget-value" for="planner-budget">S/ 60.00</output><input id="planner-budget" type="range" min="30" max="200" step="1" value="60" aria-describedby="planner-budget-hint"><small id="planner-budget-hint">De S/ 30 a S/ 200. Ajusta tu presupuesto y las cantidades.</small></div>
        <div class="planner-items">${products.map((product, index) => `<div class="planner-item" data-planner-item="${index}">${icon(product)}<div class="item-copy"><strong>${product.name}</strong><small>${money(product.price)} / ${product.unit}</small></div>${quantityControl(product, index, 'planner')}<strong class="item-cost" id="planner-cost-${index}">${money(product.price * state.quantities[index])}</strong></div>`).join('')}</div>
        <div class="planner-summary" aria-live="polite" aria-atomic="true"><div class="summary-line"><span>Total estimado</span><strong id="planner-total">S/ 39.50</strong></div><div class="summary-line balance" id="planner-balance-line"><span>Saldo disponible</span><strong id="planner-balance">S/ 20.50</strong></div></div>
        <p class="fine-print" id="planner-budget-status" role="status"></p>
        <p class="fine-print">Precios referenciales; cada bodega confirma sus ofertas.</p>
        <div class="modal-actions"><button class="button" id="download-list" type="button"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M5 16v5h14v-5"/></svg>Descargar lista</button><button class="button button-secondary" id="request-quotes" type="button">Solicitar cotizaciones</button></div>
        <p class="fine-print" id="planner-message" role="status" aria-live="polite"></p>
      </div>
    </dialog>`;
    document.body.append(host);

    host.querySelectorAll('[data-close-dialog]').forEach(button => {
      button.addEventListener('click', () => button.closest('dialog').close());
    });
    host.querySelectorAll('dialog').forEach(dialog => {
      dialog.addEventListener('close', () => {
        document.body.classList.remove('modal-open');
        if (returnFocus && document.contains(returnFocus)) returnFocus.focus({ preventScroll: true });
      });
      dialog.addEventListener('click', event => {
        if (event.target !== dialog) return;
        const bounds = dialog.getBoundingClientRect();
        const outside = event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
        if (outside) dialog.close();
      });
    });
  }

  function openDialog(id) {
    const dialog = document.getElementById(id);
    returnFocus = document.activeElement;
    document.body.classList.add('modal-open');
    dialog.showModal();
    if (id === 'planner-modal') document.getElementById('planner-title').focus({ preventScroll: true });
  }

  function renderCalculator() {
    const controls = document.getElementById('product-controls');
    if (!controls) return;
    controls.innerHTML = products.map((product, index) => `<div class="product-control" data-product="${index}"><button type="button" class="product-toggle" data-toggle-product="${index}" aria-pressed="true" aria-label="Incluir ${product.name} en mi lista">${icon(product)}<span class="product-copy"><strong>${product.name}</strong><small>${money(product.price)} / ${product.unit}</small></span><span class="product-selected" aria-hidden="true">✓</span></button>${quantityControl(product, index, 'calculator')}</div>`).join('');
    const budgetInput = document.getElementById('budget');
    if (budgetInput) {
      budgetInput.addEventListener('input', () => updateBudget(budgetInput.value));
    }
  }

  function syncQuantityControls() {
    products.forEach((product, index) => {
      const quantity = state.quantities[index];
      setText(`calculator-quantity-${index}`, quantity);
      setText(`planner-quantity-${index}`, quantity);
      setText(`planner-cost-${index}`, money(product.price * quantity));
      document.querySelectorAll(`[data-quantity="${index}"]`).forEach(button => {
        const step = Number(button.dataset.step);
        button.disabled = (step < 0 && quantity === 0) || (step > 0 && quantity === 50);
      });
      const toggle = document.querySelector(`[data-toggle-product="${index}"]`);
      if (toggle) {
        toggle.setAttribute('aria-pressed', String(quantity > 0));
        toggle.closest('.product-control').classList.toggle('is-selected', quantity > 0);
      }
      const item = document.querySelector(`[data-planner-item="${index}"]`);
      if (item) item.classList.toggle('is-removed', quantity === 0);
    });
  }

  function syncView() {
    syncQuantityControls();
    const sum = total();
    const available = balance();
    ['budget-value', 'receipt-budget', 'planner-budget-value'].forEach(id => setText(id, money(state.budget * 100)));
    ['receipt-total', 'planner-total'].forEach(id => setText(id, money(sum)));
    ['receipt-balance', 'planner-balance'].forEach(id => {
      setText(id, money(available));
      const element = document.getElementById(id);
      if (element) element.classList.toggle('is-over-budget', available < 0);
    });
    document.getElementById('planner-balance-line').classList.toggle('is-over-budget', available < 0);
    ['budget', 'planner-budget'].forEach(id => {
      const slider = document.getElementById(id);
      if (slider) {
        slider.value = state.budget;
        slider.setAttribute('aria-valuetext', `${state.budget} soles`);
        slider.style.setProperty('--range-progress', `${((state.budget - 30) / 170) * 100}%`);
      }
    });
    const receipt = document.getElementById('receipt-items');
    if (receipt) {
      receipt.innerHTML = products.map((product, index) => state.quantities[index] ? `<div class="ticket-line"><span>${product.name} <small>${state.quantities[index]} ${state.quantities[index] === 1 ? product.unit : product.plural}</small></span><strong>${money(product.price * state.quantities[index])}</strong></div>` : '').join('') || '<p class="fine-print receipt-empty">Tu boleta está vacía. Agrega productos para empezar.</p>';
    }
    const budgetMessage = available < 0
      ? `Te pasas de tu presupuesto por ${money(-available)}. Puedes ajustar las cantidades o el presupuesto.`
      : sum === 0 ? 'Agrega los productos que necesitas para armar tu lista.' : `Tienes ${money(available)} disponibles para completar tu compra.`;
    setText('calculator-status', `Total estimado: ${money(sum)}. ${budgetMessage}`);
    setText('planner-budget-status', budgetMessage);
  }

  function updateBudget(value) {
    const amount = Number(value);
    state.budget = Number.isFinite(amount) ? Math.min(200, Math.max(30, Math.round(amount))) : 60;
    syncView();
  }

  function getValues() {
    return {
      name: form.elements.name.value.trim().replace(/\s+/g, ' '),
      email: form.elements.email.value.trim(),
      district: form.elements.district.value,
      privacy: form.elements.privacy.checked
    };
  }

  function validateField(field, values) {
    switch (field) {
      case 'name': {
        const letters = values.name.match(/\p{L}/gu) || [];
        return letters.length >= 2 && values.name.length <= 100 && /^[\p{L}\p{M}\s.'’\-]+$/u.test(values.name) ? '' : 'Escribe tu nombre con al menos 2 letras.';
      }
      case 'email':
        return values.email.length <= 254 && !form.elements.email.validity.typeMismatch && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email) ? '' : 'Ingresa un correo válido, por ejemplo: nombre@correo.com.';
      case 'district':
        return districtNames.includes(values.district) ? '' : 'Elige el distrito donde haces tus compras.';
      case 'privacy':
        return values.privacy ? '' : 'Acepta la política de privacidad para crear tu lista.';
      default:
        return '';
    }
  }

  function showError(field, message) {
    const input = form.elements[field];
    const error = document.getElementById(`${field}-error`);
    input.setAttribute('aria-invalid', String(Boolean(message)));
    if (error) {
      error.textContent = message;
      error.hidden = !message;
    }
  }

  function leadItems() {
    return products.flatMap((product, index) => state.quantities[index] > 0 ? [{ name: product.name, quantity: state.quantities[index], unit: product.unit, unitPrice: product.price / 100 }] : []);
  }

  function saveLead(values) {
    lead = { ...values, variant, date: new Date().toISOString(), budget: state.budget, items: leadItems() };
    storageAvailable = true;
    try {
      let existing = [];
      try {
        const stored = JSON.parse(localStorage.getItem('bodefy_leads') || '[]');
        if (Array.isArray(stored)) existing = stored.filter(item => item && typeof item === 'object' && !Array.isArray(item));
      } catch (_) {
        existing = [];
      }
      existing.push(lead);
      localStorage.setItem('bodefy_leads', JSON.stringify(existing));
    } catch (_) {
      storageAvailable = false;
    }
  }

  function downloadList() {
    if (!lead) return;
    const lines = [
      'BODEFY — PLANIFICADOR SEMANAL',
      'Tú pides, tu barrio responde.',
      '',
      `Nombre: ${lead.name}`,
      `Distrito: ${lead.district}`,
      `Fecha: ${new Date().toLocaleDateString('es-PE')}`,
      `Presupuesto semanal: ${money(state.budget * 100)}`,
      '',
      'MI LISTA',
      ...products.flatMap((product, index) => state.quantities[index] > 0
        ? [`- ${product.name}: ${state.quantities[index]} ${state.quantities[index] === 1 ? product.unit : product.plural} × ${money(product.price)} = ${money(product.price * state.quantities[index])}`]
        : []),
      ...(total() === 0 ? ['Aún no hay productos en tu lista.'] : []),
      '',
      `Total estimado: ${money(total())}`,
      `Saldo disponible: ${money(balance())}`,
      '',
      'Precios referenciales; cada bodega confirma sus ofertas.',
      'Sin tarjeta. Sin obligación de compra.',
      'Prototipo académico · UPC 2026 · Laboratorio 8'
    ];
    const file = new Blob(['\uFEFF', lines.join('\r\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bodefy-lista-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setText('planner-message', 'Tu descarga está lista. Puedes seguir editando y descargar tu lista otra vez.');
  }

  createDialogs();
  renderCalculator();
  syncView();

  document.addEventListener('click', event => {
    const privacyButton = event.target.closest('[data-privacy]');
    if (privacyButton) {
      event.preventDefault();
      openDialog('privacy-modal');
      return;
    }
    const quantityButton = event.target.closest('[data-quantity]');
    if (quantityButton) {
      const index = Number(quantityButton.dataset.quantity);
      state.quantities[index] = Math.max(0, Math.min(50, state.quantities[index] + Number(quantityButton.dataset.step)));
      syncView();
      return;
    }
    const toggle = event.target.closest('[data-toggle-product]');
    if (toggle) {
      const index = Number(toggle.dataset.toggleProduct);
      state.quantities[index] = state.quantities[index] > 0 ? 0 : products[index].quantity;
      syncView();
    }
  });

  document.getElementById('planner-budget').addEventListener('input', event => updateBudget(event.target.value));
  document.getElementById('download-list').addEventListener('click', downloadList);
  document.getElementById('request-quotes').addEventListener('click', () => {
    if (lead) setText('planner-message', `Enviaremos tu lista a las bodegas de ${lead.district} cuando el piloto esté activo.`);
  });

  ['name', 'email', 'district', 'privacy'].forEach(field => {
    const input = form.elements[field];
    input.addEventListener(field === 'name' || field === 'email' ? 'input' : 'change', () => {
      if (input.getAttribute('aria-invalid') === 'true') showError(field, validateField(field, getValues()));
      setText('form-status', '');
    });
    input.addEventListener('blur', () => {
      if (input.value || input.getAttribute('aria-invalid') === 'true') showError(field, validateField(field, getValues()));
    });
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    const values = getValues();
    let firstInvalid = null;
    ['name', 'email', 'district', 'privacy'].forEach(field => {
      const message = validateField(field, values);
      showError(field, message);
      if (message && !firstInvalid) firstInvalid = form.elements[field];
    });
    if (firstInvalid) {
      setText('form-status', 'Revisa los campos indicados para crear tu lista.');
      firstInvalid.focus();
      return;
    }
    saveLead(values);
    setText('form-status', '¡Tu lista está lista!');
    setText('planner-greeting', `Hola, ${values.name}. Esta es tu lista para comprar en ${values.district}. Ajústala a tu semana y descárgala gratis.`);
    setText('planner-message', storageAvailable ? '' : 'Tu navegador no pudo guardar tus datos. Puedes editar y descargar tu lista ahora.');
    syncView();
    openDialog('planner-modal');
  });
})();
