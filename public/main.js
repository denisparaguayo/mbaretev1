// ════════════════════════════════════════════════════════
// MBARETE DIGITAL — main.js
// ════════════════════════════════════════════════════════

// ────────────────────────────────────────
// CONFIG DESDE EL HTML
// ────────────────────────────────────────
const CONFIG = {
	whatsapp: document.body?.dataset?.whatsapp || '595986550235',
	mensajeWA:
		document.body?.dataset?.whatsappMessage ||
		'Hola Mbarete Digital! Quiero consultar sobre una página web para mi negocio 👋',
	horarioDesde: 8,
	horarioHasta: 22,
	diasHabiles: [1, 2, 3, 4, 5, 6],
};

// ────────────────────────────────────────
// HELPERS
// ────────────────────────────────────────
function buildWaUrl(customMessage) {
	const msg = customMessage || CONFIG.mensajeWA;
	return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
}

function setWaLink(el, message) {
	if (!el) return;
	el.href = buildWaUrl(message);
	el.target = '_blank';
	el.rel = 'noopener noreferrer';
}

// ────────────────────────────────────────
// 1. WHATSAPP
// ────────────────────────────────────────
function initWhatsAppLinks() {
	const waIds = [
		'navbar-wa',
		'hero-wa',
		'rubros-wa',
		'cta-wa',
		'footer-wa',
		'wa-float',
	];
	waIds.forEach((id) => setWaLink(document.getElementById(id)));

	document.querySelectorAll('.btn[data-plan]').forEach((btn) => {
		const plan = btn.getAttribute('data-plan');
		if (!plan) return;
		setWaLink(
			btn,
			`Hola Mbarete Digital! Quiero consultar sobre el Plan ${plan} para mi negocio 👋`
		);
	});

	document.querySelectorAll('.rubro-item').forEach((item) => {
		const texto = item.querySelector('.rubro-item__text')?.textContent?.trim();
		if (!texto) return;

		setWaLink(
			item,
			`Hola Mbarete Digital! Quiero una página web para mi negocio de ${texto} 👋`
		);
	});
}

// ────────────────────────────────────────
// 2. NAVBAR
// ────────────────────────────────────────
function initNavbar() {
	const navbar = document.getElementById('navbar');
	if (!navbar) return;

	let navHeight = navbar.offsetHeight;
	const isSolid = navbar.classList.contains('navbar--solid');

	window.addEventListener(
		'resize',
		() => {
			navHeight = navbar.offsetHeight;
		},
		{ passive: true }
	);

	function updateNavbar() {
		if (isSolid) {
			navbar.classList.add('scrolled');
			return;
		}

		navbar.classList.toggle('scrolled', window.scrollY > 50);
	}

	updateNavbar();
	window.addEventListener('scroll', updateNavbar, { passive: true });

	navbar._cachedHeight = () => navHeight;
}

// ────────────────────────────────────────
// 3. HAMBURGER MENU
// ────────────────────────────────────────
function initHamburger() {
	const hamburger = document.getElementById('hamburger');
	const navLinks = document.getElementById('nav-links');
	if (!hamburger || !navLinks) return;

	function toggleMenu(open) {
		hamburger.classList.toggle('open', open);
		navLinks.classList.toggle('open', open);
		hamburger.setAttribute('aria-expanded', String(open));
		document.body.style.overflow = open ? 'hidden' : '';
	}

	hamburger.addEventListener('click', () => {
		const isOpen = navLinks.classList.contains('open');
		toggleMenu(!isOpen);
	});

	navLinks.querySelectorAll('a').forEach((link) => {
		link.addEventListener('click', () => toggleMenu(false));
	});

	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && navLinks.classList.contains('open')) {
			toggleMenu(false);
		}
	});

	window.addEventListener(
		'resize',
		() => {
			if (window.innerWidth >= 768) toggleMenu(false);
		},
		{ passive: true }
	);
}

// ────────────────────────────────────────
// 4. STATUS BADGE
// ────────────────────────────────────────
function initStatusBadge() {
	const badge = document.getElementById('status-badge');
	const dot = document.getElementById('status-dot');
	const textEl = document.getElementById('status-text');
	if (!badge || !dot || !textEl) return;

	const now = new Date();
	const utc = now.getTime() + now.getTimezoneOffset() * 60000;
	const pyTime = new Date(utc + -4 * 3600000);

	const hora = pyTime.getHours();
	const minutos = pyTime.getMinutes();
	const diaSemana = pyTime.getDay();

	const diaHabil = CONFIG.diasHabiles.includes(diaSemana === 0 ? 7 : diaSemana);
	const horaActualDecimal = hora + minutos / 60;

	const estaAbierto =
		diaHabil &&
		horaActualDecimal >= CONFIG.horarioDesde &&
		horaActualDecimal < CONFIG.horarioHasta;

	if (estaAbierto) {
		textEl.textContent = 'Abierto ahora';
		dot.classList.add('active');
		badge.classList.remove('closed');
	} else {
		textEl.textContent = 'Fuera de horario';
		dot.classList.remove('active');
		badge.classList.add('closed');
	}
}

// ────────────────────────────────────────
// 5. COUNTERS
// ────────────────────────────────────────
function animateCounter(el, target, suffix, duration) {
	const start = performance.now();

	function step(timestamp) {
		const elapsed = timestamp - start;
		const progress = Math.min(elapsed / duration, 1);
		const eased = 1 - Math.pow(1 - progress, 4);
		const current = Math.round(eased * target);
		el.textContent = current + (suffix || '');

		if (progress < 1) requestAnimationFrame(step);
	}

	requestAnimationFrame(step);
}

function initCounters() {
	const counters = document.querySelectorAll('.stat-card__number[data-target]');
	if (!counters.length) return;

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;

				const el = entry.target;
				const target = parseInt(el.getAttribute('data-target'), 10);
				const suffix = el.getAttribute('data-suffix') || '';

				animateCounter(el, target, suffix, 1500);
				observer.unobserve(el);
			});
		},
		{ threshold: 0.5 }
	);

	counters.forEach((el) => observer.observe(el));
}

// ────────────────────────────────────────
// 6. FADE UP
// ────────────────────────────────────────
function initFadeUp() {
	const elements = document.querySelectorAll('.fade-up');
	if (!elements.length) return;

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				entry.target.classList.add('visible');
				observer.unobserve(entry.target);
			});
		},
		{
			threshold: 0.12,
			rootMargin: '0px 0px -40px 0px',
		}
	);

	elements.forEach((el) => observer.observe(el));
}

// ────────────────────────────────────────
// 7. FAQ
// ────────────────────────────────────────
function initFAQ() {
	const items = document.querySelectorAll('.faq-item');
	if (!items.length) return;

	items.forEach((item) => {
		const btn = item.querySelector('.faq-item__question');
		const answer = item.querySelector('.faq-item__answer');
		if (!btn || !answer) return;

		btn.addEventListener('click', () => {
			const isOpen = btn.getAttribute('aria-expanded') === 'true';

			items.forEach((other) => {
				if (other !== item) {
					const otherBtn = other.querySelector('.faq-item__question');
					const otherAnswer = other.querySelector('.faq-item__answer');
					if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
					if (otherAnswer) otherAnswer.classList.remove('open');
				}
			});

			const nextState = !isOpen;
			btn.setAttribute('aria-expanded', String(nextState));
			answer.classList.toggle('open', nextState);
		});
	});
}

// ────────────────────────────────────────
// 8. SMOOTH SCROLL
// ────────────────────────────────────────
function initSmoothScroll() {
	const navbar = document.getElementById('navbar');

	document.querySelectorAll('a[href^="#"]').forEach((link) => {
		link.addEventListener('click', (e) => {
			const href = link.getAttribute('href');
			if (!href || href === '#') return;

			let target;
			try {
				target = document.querySelector(href);
			} catch {
				return;
			}

			if (!target) return;

			e.preventDefault();

			const navHeight = navbar?._cachedHeight?.() ?? navbar?.offsetHeight ?? 0;
			const top =
				target.getBoundingClientRect().top + window.scrollY - navHeight - 12;

			window.scrollTo({ top, behavior: 'smooth' });
		});
	});
}
function initLeadForms() {
	const forms = document.querySelectorAll('[data-lead-form]');
	if (!forms.length) return;

	forms.forEach((form) => {
		form.addEventListener('submit', (e) => {
			e.preventDefault();

			const wrapper = form.closest('.lead-box');
			const source = wrapper?.dataset?.source || 'sitio web';

			const formData = new FormData(form);
			const name = String(formData.get('name') || '').trim();
			const phone = String(formData.get('phone') || '').trim();
			const business = String(formData.get('business') || '').trim();
			const need = String(formData.get('need') || '').trim();

			const msg =
				`Hola Mbarete Digital! 👋\n\n` +
				`Quiero una auditoría / recomendación para mi negocio.\n\n` +
				`👸 Nombre: ${name}\n` +
				`📲 WhatsApp: ${phone}\n` +
				`🏪 Negocio: ${business}\n` +
				`🎯 Necesito: ${need}\n` +
				`📍 Fuente: ${source}`;

			window.open(buildWaUrl(msg), '_blank', 'noopener,noreferrer');
		});
	});
}

// ────────────────────────────────────────
// INIT
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
	initLeadForms();
});
