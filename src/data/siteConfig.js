export const siteConfig = {
	name: 'Mbarete Digital',
	url: 'https://mbarete.online/',

	// CONTACTO
	email: 'hola@mbarete.online',
	phone: '0986 550 235',
	whatsapp: '595986550235',

	// MENSAJES CENTRALIZADOS
	messages: {
		default:
			'Hola Mbarete Digital! Quiero consultar sobre una página web para mi negocio 👋',

		faq: 'Hola Mbarete Digital! Estuve viendo la página de preguntas frecuentes y quiero hacer una consulta 👋',

		plan: (plan) =>
			`Hola Mbarete Digital! Quiero consultar sobre el Plan ${plan} para mi negocio 👋`,

		rubro: (rubro) =>
			`Hola Mbarete Digital! Quiero una página web para mi negocio de ${rubro} 👋`,
	},

	// UBICACIÓN
	address: {
		city: 'Asunción',
		country: 'Paraguay',
	},

	// HORARIOS
	hours: {
		days: 'Lunes a Viernes',
		time: '08:00–18:00',
	},

	// REDES
	socials: {
		instagram: '#',
		facebook: '#',
	},

	// SEO GLOBAL
	seo: {
		defaultTitle:
			'Diseño Web en Paraguay | Páginas Web Profesionales — Mbarete Digital',

		defaultDescription:
			'Diseño web en Paraguay desde Gs. 800.000. Creamos páginas web profesionales para negocios en Asunción y todo el país. SEO, WhatsApp y entrega en 1-2 días.',

		ogImage: 'https://mbarete.online/og-image.jpg',
	},
};

// ════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════

// Generador de URL WhatsApp (global)
export function getWhatsAppUrl(message) {
	const text = message || siteConfig.messages.default;
	return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(text)}`;
}

// Helpers específicos (opcional pero PRO)
export function getPlanWhatsApp(plan) {
	return getWhatsAppUrl(siteConfig.messages.plan(plan));
}

export function getRubroWhatsApp(rubro) {
	return getWhatsAppUrl(siteConfig.messages.rubro(rubro));
}
