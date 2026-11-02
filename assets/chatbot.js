(() => {
  'use strict';

  const faq = [
    {
      question: '¿Qué es Bodefy?',
      answer: 'Bodefy conecta tu lista con bodegas cercanas para comparar cotizaciones y recoger tu compra.',
      keywords: ['que es', 'bodefy', 'funciona', 'barrio', 'bodega', 'recoger', 'delivery', 'entrega']
    },
    {
      question: '¿El planificador es gratis?',
      answer: 'Sí. No necesitas tarjeta ni estás obligado a comprar.',
      keywords: ['gratis', 'gratuit', 'tarjeta', 'pago', 'pagar', 'cuesta', 'costo', 'obligacion']
    },
    {
      question: '¿Qué recibiré?',
      answer: 'Una lista editable y un presupuesto estimado que puedes descargar.',
      keywords: ['recib', 'descarg', 'editable', 'editar', 'presupuesto', 'archivo', 'lista']
    },
    {
      question: '¿Los precios y el stock están confirmados?',
      answer: 'Los importes del planificador son referenciales. Cada bodega confirma precio y disponibilidad al cotizar.',
      keywords: ['precio', 'stock', 'confirm', 'disponib', 'cotiza', 'oferta', 'referencial']
    },
    {
      question: '¿Cómo empiezo?',
      answer: 'Completa tu nombre, correo y distrito, y arma tu lista. Pulsa «Crear mi lista gratis».',
      keywords: ['empez', 'empiez', 'comienz', 'comenz', 'crear', 'creo', 'registr', 'nombre', 'correo', 'distrito', 'formulario']
    }
  ];

  const normalize = (value) => value.toLocaleLowerCase('es-PE')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function avatar() {
    const container = element('span', 'bodi-avatar');
    container.setAttribute('aria-hidden', 'true');
    container.innerHTML = '<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M32 16V9" stroke="#1747A6" stroke-width="4" stroke-linecap="round"/><circle cx="32" cy="7" r="5" fill="#1F9D55"/><rect x="9" y="17" width="46" height="39" rx="14" fill="#1747A6"/><rect x="16" y="25" width="32" height="19" rx="8" fill="#0B1F3A"/><path d="M24 32v5M40 32v5" stroke="#FBF7EF" stroke-width="4" stroke-linecap="round"/><path d="M28 48h8" stroke="#FBF7EF" stroke-width="3" stroke-linecap="round"/><path d="M5 31v10M59 31v10" stroke="#1747A6" stroke-width="5" stroke-linecap="round"/></svg>';
    return container;
  }

  function icon(kind) {
    const container = element('span');
    container.setAttribute('aria-hidden', 'true');
    const path = kind === 'close'
      ? '<path d="m6 6 12 12M6 18 18 6"/>'
      : '<path d="m22 2-7 20-4-9-9-4 20-7ZM22 2 11 13"/>';
    container.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
    return container;
  }

  function initialize() {
    if (document.querySelector('.bodi-widget')) return;

    const widget = element('aside', 'bodi-widget');
    widget.setAttribute('aria-label', 'Asistente Bodi');

    const launcher = element('button', 'bodi-launcher');
    launcher.type = 'button';
    launcher.setAttribute('aria-label', 'Abrir chat con Bodi');
    launcher.setAttribute('aria-controls', 'bodi-panel');
    launcher.setAttribute('aria-expanded', 'false');
    launcher.append(avatar(), element('span', 'bodi-launcher-label', 'Bodi'));

    const panel = element('section', 'bodi-panel');
    panel.id = 'bodi-panel';
    panel.hidden = true;
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-labelledby', 'bodi-title');

    const header = element('header', 'bodi-header');
    const headerCopy = element('div', 'bodi-header-copy');
    const title = element('h2', 'bodi-header-title', 'Bodi');
    title.id = 'bodi-title';
    headerCopy.append(title, element('p', 'bodi-status', 'Tu asistente de compras'));
    const close = element('button', 'bodi-close');
    close.type = 'button';
    close.setAttribute('aria-label', 'Cerrar chat');
    close.append(icon('close'));
    header.append(avatar(), headerCopy, close);

    const messages = element('div', 'bodi-messages');
    messages.setAttribute('role', 'log');
    messages.setAttribute('aria-live', 'polite');
    messages.setAttribute('aria-relevant', 'additions');
    messages.setAttribute('aria-label', 'Conversación con Bodi');
    messages.tabIndex = 0;
    const options = element('div', 'bodi-options');
    options.setAttribute('aria-label', 'Opciones de Bodi');

    const form = element('form', 'bodi-input-form');
    const label = element('label', 'bodi-label', 'Tu mensaje');
    label.htmlFor = 'bodi-input';
    const input = element('input', 'bodi-input');
    input.id = 'bodi-input';
    input.name = 'mensaje';
    input.type = 'text';
    input.maxLength = 280;
    input.placeholder = 'Escribe tu duda…';
    input.autocomplete = 'off';
    const send = element('button', 'bodi-send');
    send.type = 'submit';
    send.setAttribute('aria-label', 'Enviar mensaje');
    send.append(icon('send'));
    form.append(label, input, send);

    panel.append(header, messages, options, form);

    const teaser = element('div', 'bodi-teaser');
    teaser.hidden = true;
    const teaserAction = element('button', 'bodi-teaser-action', 'Hola, soy Bodi. ¿Armamos tu lista?');
    teaserAction.type = 'button';
    const teaserClose = element('button', 'bodi-teaser-close');
    teaserClose.type = 'button';
    teaserClose.setAttribute('aria-label', 'Ocultar saludo de Bodi');
    teaserClose.append(icon('close'));
    teaser.append(teaserAction, teaserClose);
    widget.append(teaser, panel, launcher);
    document.body.append(widget);

    let started = false;
    let replying = false;
    let replyTimer = null;
    let greetingTimer = null;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function markGreetingSeen() {
      try {
        sessionStorage.setItem('bodefy_bodi_greeted', '1');
      } catch (_) {
        // El chat también funciona si el navegador bloquea el almacenamiento.
      }
    }

    function scrollConversation() {
      messages.scrollTop = messages.scrollHeight;
    }

    function addMessage(text, fromUser = false) {
      const message = element('p', `bodi-message${fromUser ? ' bodi-message-user' : ''}`, text);
      message.setAttribute('aria-label', `${fromUser ? 'Tú' : 'Bodi'}: ${text}`);
      messages.append(message);
      scrollConversation();
    }

    function choice(text, handler, primary = false) {
      const button = element('button', `bodi-option${primary ? ' bodi-option-primary' : ''}`, text);
      button.type = 'button';
      button.addEventListener('click', handler);
      options.append(button);
      return button;
    }

    function closePanel(restoreFocus = true) {
      panel.hidden = true;
      launcher.setAttribute('aria-expanded', 'false');
      launcher.setAttribute('aria-label', 'Abrir chat con Bodi');
      if (restoreFocus) launcher.focus();
    }

    function goToPlanner() {
      const target = document.getElementById('planificador');
      if (!target) return;
      if (window.matchMedia('(max-width: 767px)').matches) closePanel(false);
      teaser.hidden = true;
      target.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
      const name = target.querySelector('input[autocomplete="given-name"], input[name="nombre"], input[name="name"], input[type="text"]');
      if (name) name.focus({ preventScroll: true });
    }

    function showFollowUp() {
      options.replaceChildren();
      choice('Crear mi lista gratis', goToPlanner, true);
      choice('Otra pregunta', showQuestions);
      options.scrollTop = 0;
    }

    function showQuestions() {
      options.replaceChildren();
      faq.forEach((item) => {
        choice(item.question, () => respond(item.question, item.answer));
      });
      options.scrollTop = 0;
      options.firstElementChild?.focus({ preventScroll: true });
      scrollConversation();
    }

    function respond(question, answer, fromText = false) {
      if (replying) return;
      replying = true;
      addMessage(question, true);
      options.replaceChildren();
      input.disabled = true;
      send.disabled = true;
      const typing = element('div', 'bodi-typing');
      typing.setAttribute('role', 'status');
      typing.setAttribute('aria-label', 'Bodi está escribiendo');
      for (let index = 0; index < 3; index += 1) {
        const dot = element('span');
        dot.setAttribute('aria-hidden', 'true');
        typing.append(dot);
      }
      messages.append(typing);
      scrollConversation();
      replyTimer = window.setTimeout(() => {
        typing.remove();
        addMessage(answer);
        showFollowUp();
        input.disabled = false;
        send.disabled = false;
        replying = false;
        replyTimer = null;
        // Recupera el foco perdido al retirar una opción, sin interrumpir otros controles.
        const active = document.activeElement;
        if (!panel.hidden && (active === document.body || active === input || active === send)) {
          // Un FAQ mantiene el foco en sus acciones y no abre el teclado del celular.
          const focusTarget = fromText ? input : options.firstElementChild;
          focusTarget?.focus({ preventScroll: true });
        }
      }, reducedMotion.matches ? 150 : 850);
    }

    function findAnswer(question) {
      const normalized = normalize(question);
      // Las preguntas específicas tienen prioridad sobre las menciones generales a la lista.
      const order = [3, 1, 4, 2, 0];
      const matched = order.find((index) => faq[index].keywords.some((word) => normalized.includes(word)));
      return matched === undefined
        ? 'Todavía estoy aprendiendo y no tengo una respuesta para esa duda. Puedo ayudarte con el planificador, los precios referenciales o cómo empezar. Crea tu lista gratis y organiza tu compra de la semana.'
        : faq[matched].answer;
    }

    function openPanel() {
      clearTimeout(greetingTimer);
      teaser.hidden = true;
      markGreetingSeen();
      panel.hidden = false;
      launcher.setAttribute('aria-expanded', 'true');
      launcher.setAttribute('aria-label', 'Cerrar chat con Bodi');
      if (!started) {
        addMessage('¡Hola! Soy Bodi. Te ayudo a organizar tu compra.');
        addMessage('¿Quieres crear tu lista o resolver una duda?');
        choice('Crear mi lista gratis', goToPlanner, true);
        choice('Tengo una duda', showQuestions);
        started = true;
      }
      (options.firstElementChild || close).focus({ preventScroll: true });
      scrollConversation();
    }

    launcher.addEventListener('click', () => panel.hidden ? openPanel() : closePanel());
    close.addEventListener('click', () => closePanel());
    teaserAction.addEventListener('click', openPanel);
    teaserClose.addEventListener('click', () => {
      teaser.hidden = true;
      markGreetingSeen();
      launcher.focus({ preventScroll: true });
    });
    widget.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !panel.hidden) {
        event.preventDefault();
        closePanel();
      }
    });
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const question = input.value.trim();
      if (!question || replying) return;
      input.value = '';
      respond(question, findAnswer(question), true);
    });

    let greetingSeen = false;
    try {
      greetingSeen = sessionStorage.getItem('bodefy_bodi_greeted') === '1';
    } catch (_) {
      // Sin almacenamiento, el saludo aparece una sola vez durante esta visita.
    }
    if (!greetingSeen) {
      greetingTimer = window.setTimeout(() => {
        if (!panel.hidden) return;
        try {
          if (sessionStorage.getItem('bodefy_bodi_greeted') === '1') return;
        } catch (_) {
          // Mantiene el saludo disponible cuando sessionStorage no está permitido.
        }
        teaser.hidden = false;
        markGreetingSeen();
      }, 6000);
    }

    window.addEventListener('pagehide', () => {
      clearTimeout(greetingTimer);
      if (replyTimer) {
        clearTimeout(replyTimer);
        messages.querySelector('.bodi-typing')?.remove();
        replying = false;
        input.disabled = false;
        send.disabled = false;
        showFollowUp();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
})();
