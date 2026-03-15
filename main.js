// ════════════════════════════════════════════════════════
//  MBARETE DIGITAL — main.js
//  Agencia de diseño web en Paraguay
// ════════════════════════════════════════════════════════

// ════════════════════════════════════════
// CONFIGURACIÓN — EDITÁ ACÁ
// ════════════════════════════════════════
const CONFIG = {
  whatsapp: '595986550235',
  mensajeWA: 'Hola Mbarete Digital! Quiero consultar sobre una página web para mi negocio 👋',
  horarioDesde: 8,       // hora apertura (formato 24h, hora Paraguay)
  horarioHasta: 22,      // hora cierre
  diasHabiles: [1,2,3,4,5,6], // 1=lunes ... 7=domingo (JS: 0=domingo ... 6=sábado)
};

// ────────────────────────────────────────
// HELPERS
// ────────────────────────────────────────

/**
 * Genera la URL de WhatsApp con número y mensaje predefinido
 * @param {string} planNombre - nombre del plan elegido (opcional)
 * @returns {string} URL de WhatsApp
 */
function buildWaUrl(planNombre) {
  const msg = planNombre
    ? `Hola Mbarete Digital! Quiero consultar sobre el ${planNombre} para mi negocio 👋`
    : CONFIG.mensajeWA;
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
}

/**
 * Asigna la URL de WhatsApp a un elemento
 * @param {HTMLElement} el
 * @param {string} [plan]
 */
function setWaLink(el, plan) {
  if (!el) return;
  el.href = buildWaUrl(plan);
  el.target = '_blank';
  el.rel = 'noopener noreferrer';
}

// ────────────────────────────────────────
// 1. WHATSAPP — asignar links
// ────────────────────────────────────────
function initWhatsAppLinks() {
  // Botones fijos
  const waIds = ['navbar-wa', 'hero-wa', 'rubros-wa', 'cta-wa', 'footer-wa', 'wa-float'];
  waIds.forEach(id => setWaLink(document.getElementById(id)));

  // Botones de planes (con nombre del plan en el mensaje)
  document.querySelectorAll('.btn[data-plan]').forEach(btn => {
    const plan = btn.getAttribute('data-plan');
    setWaLink(btn, `Plan ${plan}`);
  });

  // Rubros — cada item lleva mensaje con el rubro
  document.querySelectorAll('.rubro-item').forEach(item => {
    const texto = item.querySelector('.rubro-item__text')?.textContent?.trim();
    if (texto) {
      const msg = `Hola Mbarete Digital! Quiero una página web para mi negocio de ${texto} 👋`;
      item.href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
      item.target = '_blank';
      item.rel = 'noopener noreferrer';
    }
  });
}

// ────────────────────────────────────────
// 2. NAVBAR — clase scrolled al bajar 50px
// ────────────────────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  // Cachear altura del navbar para evitar reflow en scroll
  let navHeight = navbar.offsetHeight;

  // Actualizar caché solo al redimensionar (no en cada scroll)
  window.addEventListener('resize', () => {
    navHeight = navbar.offsetHeight;
  }, { passive: true });

  function updateNavbar() {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }

  updateNavbar();
  window.addEventListener('scroll', updateNavbar, { passive: true });

  // Exportar altura para smooth scroll
  navbar._cachedHeight = () => navHeight;
}

// ────────────────────────────────────────
// 3. HAMBURGER MENU
// ────────────────────────────────────────
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  if (!hamburger || !navLinks) return;

  function toggleMenu(open) {
    hamburger.classList.toggle('open', open);
    navLinks.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    // Bloquear scroll del body cuando el menú está abierto
    document.body.style.overflow = open ? 'hidden' : '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.contains('open');
    toggleMenu(!isOpen);
  });

  // Cerrar al hacer clic en un link
  navLinks.querySelectorAll('.navbar__link').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Cerrar al presionar ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      toggleMenu(false);
    }
  });

  // Cerrar si se pasa a desktop (fix overflow bloqueado)
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) toggleMenu(false);
  }, { passive: true });
}

// ────────────────────────────────────────
// 4. BADGE ABIERTO / CERRADO
//    Paraguay: UTC-4 (sin horario de verano)
// ────────────────────────────────────────
function initStatusBadge() {
  const badge    = document.getElementById('status-badge');
  const dot      = document.getElementById('status-dot');
  const textEl   = document.getElementById('status-text');
  if (!badge || !dot || !textEl) return;

  // Obtener hora actual en Paraguay (UTC-4)
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const pyTime = new Date(utc + (-4 * 3600000));

  const hora    = pyTime.getHours();
  const minutos = pyTime.getMinutes();
  const diaSemana = pyTime.getDay(); // 0=domingo, 1=lunes, ...

  // JS usa 0=domingo, CONFIG usa 1=lunes...5=viernes
  const diaHabil = CONFIG.diasHabiles.includes(
    diaSemana === 0 ? 7 : diaSemana
  );
  const horaActualDecimal = hora + minutos / 60;
  const estaAbierto = diaHabil &&
    horaActualDecimal >= CONFIG.horarioDesde &&
    horaActualDecimal < CONFIG.horarioHasta;

  if (estaAbierto) {
    textEl.textContent = 'Abierto ahora';
    dot.classList.add('active');
  } else {
    textEl.textContent = 'Fuera de horario';
    badge.classList.add('closed');
  }
}

// ────────────────────────────────────────
// 5. CONTADOR ANIMADO DE STATS EN HERO
// ────────────────────────────────────────
function animateCounter(el, target, suffix, duration) {
  const start = performance.now();

  function step(timestamp) {
    const elapsed  = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    // Easing: easeOutQuart
    const eased    = 1 - Math.pow(1 - progress, 4);
    const current  = Math.round(eased * target);
    el.textContent = current + (suffix || '');
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

function initCounters() {
  const counters = document.querySelectorAll('.stat-card__number[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.getAttribute('data-target'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      animateCounter(el, target, suffix, 1500);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

// ────────────────────────────────────────
// 6. INTERSECTION OBSERVER — fade-up
// ────────────────────────────────────────
function initFadeUp() {
  const elements = document.querySelectorAll('.fade-up');
  if (!elements.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

// ────────────────────────────────────────
// 7. ACORDEÓN FAQ
// ────────────────────────────────────────
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const btn    = item.querySelector('.faq-item__question');
    const answer = item.querySelector('.faq-item__answer');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Cerrar todos los demás primero
      items.forEach(other => {
        if (other !== item) {
          const otherBtn    = other.querySelector('.faq-item__question');
          const otherAnswer = other.querySelector('.faq-item__answer');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherAnswer) otherAnswer.classList.remove('open');
        }
      });

      // Toggle el actual
      const nextState = !isOpen;
      btn.setAttribute('aria-expanded', String(nextState));
      answer.classList.toggle('open', nextState);
    });
  });
}

// ────────────────────────────────────────
// 8. SMOOTH SCROLL para links del navbar
// ────────────────────────────────────────
function initSmoothScroll() {
  // Leer altura del navbar UNA vez, no en cada click
  const navbar = document.getElementById('navbar');

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;

      let target;
      try { target = document.querySelector(href); } catch(err) { return; }
      if (!target) return;

      e.preventDefault();

      // Usar altura cacheada para evitar reflow forzado
      const navHeight = navbar?._cachedHeight?.() ?? navbar?.offsetHeight ?? 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 12;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

// ────────────────────────────────────────
// INIT — todo cuando carga el DOM
// ────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initWhatsAppLinks();
  initNavbar();
  initHamburger();
  initStatusBadge();
  initCounters();
  initFadeUp();
  initFAQ();
  initSmoothScroll();
});