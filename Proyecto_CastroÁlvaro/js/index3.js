// ---------------------------- //
// Menu mobile (abrir / cerrar) //
// ---------------------------- //
const btnCloseMenu = document.querySelector('.btn-close');
const btnOpenMenu = document.querySelector('.btn-menu-responsive');
const menuMobile = document.querySelector('.menu-mobile');

if (btnOpenMenu && menuMobile) {
	btnOpenMenu.addEventListener('click', () => {
		menuMobile.classList.add('active');
	});
} else {
	console.warn('Menu mobile: botones o contenedor no encontrados');
}

if (btnCloseMenu && menuMobile) {
	btnCloseMenu.addEventListener('click', () => {
		menuMobile.classList.remove('active');
	});
}


// FOOTER NAV LINE (menú flotante) //
const footerBtn = document.getElementById('footer-nav-btn');
const footerline = document.getElementById('footer-nav-line');
const lineItems = document.querySelectorAll('.nav-line .line-item');

if (footerBtn && footerline) {
	const openline = () => {
		footerline.classList.add('open');
		footerBtn.setAttribute('aria-expanded', true);
		document.addEventListener('click', onDocClickCloseline);
		document.addEventListener('keydown', onKeyDownline);
	};

	const closeline = () => {
		footerline.classList.remove('open');
		footerBtn.setAttribute('aria-expanded', false);
		document.removeEventListener('click', onDocClickCloseline);
		document.removeEventListener('keydown', onKeyDownline);
	};

	const onDocClickCloseline = (e) => {
		if (footerline.contains(e.target) || footerBtn.contains(e.target)) return;
		closeline();
	};

	const onKeyDownline = (e) => {
		if (e.key === 'Escape') closeline();
	};

	footerBtn.addEventListener('click', (e) => {
		e.stopPropagation();
		const isOpen = footerline.classList.contains('open');
		if (isOpen) closeline(); else openline();
	});

	lineItems.forEach(item => {
		item.addEventListener('click', (ev) => {
			ev.preventDefault();
			const target = item.dataset.target;
			closeline();

			if (target === 'home') {
				window.scrollTo({ top: 0, behavior: 'smooth' });
			} else if (target === 'recetas') {
				document.querySelector('main')?.scrollIntoView({ behavior: 'smooth' });
			} else {
				if (item.href && item.href !== '#') {
					window.location.href = item.href;
				}
			}
		});
	});
}