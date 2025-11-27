// Menu mobile (abrir / cerrar) //

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

// Favoritos (localStorage y Ordenación) //
const buttonsFavorite = document.querySelectorAll('.btn-favorite') || [];

const reorderSingleCardList = (container) => {
	const allElements = container.querySelectorAll('.card-recipe, .card-message');
	if (allElements.length === 0) return;

	const favoriteCards = [];
	const regularCards = [];
	const messageCards = [];

	Array.from(allElements).forEach(el => {

		if (el.classList.contains('card-message')) {
			messageCards.push(el);
			return;
		}


		const favoriteBtn = el.querySelector('.btn-favorite');

		if (favoriteBtn) {
			const favoriteIcon = favoriteBtn.querySelector('i');
			if (favoriteIcon && favoriteIcon.classList.contains('active')) {
				favoriteCards.push(el);
			} else {
				regularCards.push(el);
			}
		}
	});


	[...favoriteCards, ...regularCards, ...messageCards].forEach(el => {
		container.appendChild(el);
	});
};


const sortFavoriteCards = () => {
	const allContainers = document.querySelectorAll('.list-card-recipes');
	allContainers.forEach(container => {
		reorderSingleCardList(container);
	});
};


const toggleFavorite = e => {
	const btn = e.currentTarget;
	const iconBtn = btn.querySelector('i');
	const card = btn.closest('.card-recipe');
	if (!card) {
		console.warn('toggleFavorite: no se encontró .card-recipe para el botón', btn);
		return;
	}
	const titleEl = card.querySelector('h3');
	const title = titleEl ? titleEl.textContent.trim() : null;

	if (title) {
		let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
		const isFavorite = iconBtn.classList.contains('active');

		if (isFavorite) {
			favorites = favorites.filter(fav => fav !== title);
			iconBtn.classList.remove('active');
		} else {
			favorites.push(title);
			iconBtn.classList.add('active');
		}
		localStorage.setItem('favorites', JSON.stringify(favorites));

		sortFavoriteCards();
	}
};

const loadFavorites = () => {
	const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

	buttonsFavorite.forEach(btn => {
		const card = btn.closest('.card-recipe');
		const titleEl = card ? card.querySelector('h3') : null;
		const title = titleEl ? titleEl.textContent.trim() : null;
		const iconBtn = btn.querySelector('i');

		if (title && iconBtn) {
			if (favorites.includes(title)) {
				iconBtn.classList.add('active');
			} else {
				iconBtn.classList.remove('active');
			}
		}
	});

	sortFavoriteCards();
};

buttonsFavorite.forEach(btn => {
	btn.addEventListener('click', toggleFavorite);
});


// CARDS: EXPANSION (ZOOM ADAPTATIVO) y FLIP CARD // 

const body = document.body;
const recipeOverlay = document.createElement('div');
recipeOverlay.id = 'recipe-overlay';
recipeOverlay.style.display = 'none';
body.appendChild(recipeOverlay);

let activeFocusCard = null;

const openRecipeFocus = (card) => {
	if (activeFocusCard) return;

	if (card.classList.contains('card-message')) return;

	activeFocusCard = card;

	const cardRect = card.getBoundingClientRect();
	const clonedCard = card.cloneNode(true);

	clonedCard.classList.add('is-focused-cloned');

	const closeButton = document.createElement('button');
	closeButton.className = 'close-focus-btn';
	closeButton.innerHTML = '<i class="bx bx-x"></i>';
	closeButton.addEventListener('click', closeRecipeFocus);

	const flipButton = document.createElement('button');
	flipButton.className = 'toggle-flip-btn-focus';
	flipButton.innerHTML = '<i class="bx bx-rotate-right"></i>';
	flipButton.addEventListener('click', (e) => {
		e.stopPropagation();
		clonedCard.classList.toggle('is-flipped');
	});

	recipeOverlay.innerHTML = '';
	recipeOverlay.style.display = 'block';
	recipeOverlay.appendChild(clonedCard);
	recipeOverlay.appendChild(closeButton);
	recipeOverlay.appendChild(flipButton);

	clonedCard.style.position = 'fixed';
	clonedCard.style.top = `${cardRect.top}px`;
	clonedCard.style.left = `${cardRect.left}px`;
	clonedCard.style.width = `${cardRect.width}px`;
	clonedCard.style.height = `${cardRect.height}px`;
	clonedCard.style.zIndex = '10000';
	clonedCard.style.margin = '0';
	clonedCard.style.transition = 'transform 0.5s cubic-bezier(.2,.9,.3,1), top 0.5s cubic-bezier(.2,.9,.3,1), left 0.5s cubic-bezier(.2,.9,.3,1), width 0.5s cubic-bezier(.2,.9,.3,1), height 0.5s cubic-bezier(.2,.9,.3,1)';

	const viewportWidth = window.innerWidth;
	const viewportHeight = window.innerHeight;

	const originalAspectRatio = cardRect.width / cardRect.height;
	let desiredWidth = cardRect.width * 2;
	let desiredHeight = cardRect.height * 2;

	if (desiredWidth > viewportWidth * 0.9) {
		desiredWidth = viewportWidth * 0.9;
		desiredHeight = desiredWidth / originalAspectRatio;
	}
	if (desiredHeight > viewportHeight * 0.9) {
		desiredHeight = viewportHeight * 0.9;
		desiredWidth = desiredHeight * originalAspectRatio;
	}

	const targetX = (viewportWidth / 2) - (desiredWidth / 2);
	const targetY = (viewportHeight / 2) - (desiredHeight / 2);

	const backContentEl = clonedCard.querySelector('.card-back');
	backContentEl.innerHTML = getRecipeData(card);

	setTimeout(() => {
		clonedCard.style.width = `${desiredWidth}px`;
		clonedCard.style.height = `${desiredHeight}px`;
		clonedCard.style.top = `${targetY}px`;
		clonedCard.style.left = `${targetX}px`;
		clonedCard.style.transform = `none`;

		clonedCard.classList.add('is-focused');
		clonedCard.classList.add('is-flipped');
		body.style.overflow = 'hidden';

		closeButton.style.opacity = '1';
		flipButton.style.opacity = '1';
		flipButton.style.transform = 'translateY(0)';

		const onOverlayClickClose = (e) => {
			if (e.target.id === 'recipe-overlay') {
				closeRecipeFocus();
			}
		};
		recipeOverlay.addEventListener('click', onOverlayClickClose);
		recipeOverlay._overlayCloseListener = onOverlayClickClose;

	}, 10);
};

const closeRecipeFocus = () => {
	if (!activeFocusCard) return;

	if (recipeOverlay._overlayCloseListener) {
		recipeOverlay.removeEventListener('click', recipeOverlay._overlayCloseListener);
		recipeOverlay._overlayCloseListener = null;
	}

	const clonedCard = recipeOverlay.querySelector('.card-recipe');
	if (!clonedCard) return;

	const originalRect = activeFocusCard.getBoundingClientRect();

	clonedCard.classList.remove('is-focused');
	clonedCard.classList.remove('is-flipped');
	clonedCard.classList.remove('is-focused-cloned');

	clonedCard.style.top = `${originalRect.top}px`;
	clonedCard.style.left = `${originalRect.left}px`;
	clonedCard.style.width = `${originalRect.width}px`;
	clonedCard.style.height = `${originalRect.height}px`;

	const closeButton = recipeOverlay.querySelector('.close-focus-btn');
	const flipButton = recipeOverlay.querySelector('.toggle-flip-btn-focus');
	if (closeButton) closeButton.style.opacity = '0';
	if (flipButton) flipButton.style.opacity = '0';

	body.style.overflow = '';

	setTimeout(() => {
		recipeOverlay.style.display = 'none';
		recipeOverlay.innerHTML = '';
		activeFocusCard = null;
	}, 500);
};


// Funciones de Inicialización de Cards (Flip y Botón) //


const getRecipeData = (card) => {
	const ingredientsStr = card.dataset.ingredients || '';
	const stepsStr = card.dataset.steps || '';

	if (!ingredientsStr && !stepsStr) {
		return '<div class="recipe-data-full"><h3>Error</h3><p>No se encontraron ingredientes o pasos de preparación.</p></div>';
	}

	let html = '<div class="recipe-data-full">';

	if (ingredientsStr) {
		const ingredients = ingredientsStr.split('|').filter(i => i.trim() !== '');
		html += '<h3>Ingredientes</h3><ul>';
		ingredients.forEach(item => {
			html += `<li>${item.trim()}</li>`;
		});
		html += '</ul>';
	}

	if (stepsStr) {
		const steps = stepsStr.split('|').filter(s => s.trim() !== '');
		html += '<h3>Preparación</h3><ol>';
		steps.forEach(item => {
			html += `<li>${item.trim()}</li>`;
		});
		html += '</ol>';
	}

	html += '<button class="toggle-flip-back" onclick="this.closest(\'.card-recipe\').classList.remove(\'is-flipped\');">Volver a la vista principal</button>';
	html += '</div>';

	return html;
};


const attachFlipListener = (card) => {
	if (card.classList.contains('card-message')) return;

	const btn = card.querySelector('.toggle-flip');
	if (!btn) return;

	const newBtn = btn.cloneNode(true);
	btn.replaceWith(newBtn);

	newBtn.addEventListener('click', (e) => {
		e.stopPropagation();
		e.preventDefault();
		openRecipeFocus(card);
	});
};


const ensureCardStructure = (card) => {
	if (card.classList.contains('card-message')) return;

	if (card.querySelector('.card-inner')) return;

	const cardContent = Array.from(card.children);
	card.innerHTML = '';

	const inner = document.createElement('div');
	inner.className = 'card-inner';

	const front = document.createElement('div');
	front.className = 'card-front';

	const back = document.createElement('div');
	back.className = 'card-back';

	cardContent.forEach(node => {
		front.appendChild(node);
	});

	inner.appendChild(front);
	inner.appendChild(back);
	card.appendChild(inner);
};


const initRecipeCards = () => {
	const cards = document.querySelectorAll('.card-recipe') || [];

	cards.forEach(card => {
		ensureCardStructure(card);
		attachFlipListener(card);
	});
};

// Lógica de Búsqueda //
const searchInput = document.getElementById('search-input');
const searchResultsUl = document.getElementById('search-results');
const searchContainer = document.getElementById('search-container');
const searchNavButton = document.getElementById('nav-search');
let cardData = [];

const collectCardData = () => {
	const allCards = document.querySelectorAll('.card-recipe:not(.card-message)');
	cardData = [];
	allCards.forEach(card => {
		const titleEl = card.querySelector('h3');
		if (titleEl) {
			cardData.push({
				title: titleEl.textContent.trim().toLowerCase(),
				cardElement: card
			});
		}
	});
};


if (searchNavButton && searchContainer) {
	searchNavButton.addEventListener('click', (e) => {
		e.preventDefault();
		const isHidden = searchContainer.getAttribute('aria-hidden') === 'true';
		searchContainer.setAttribute('aria-hidden', isHidden ? 'false' : 'true');
		if (isHidden) {
			searchInput.focus();
		} else {
			searchResultsUl.innerHTML = '';
		}
	});
}


if (searchInput) {
	searchInput.addEventListener('input', (e) => {
		const query = e.target.value.toLowerCase().trim();
		searchResultsUl.innerHTML = '';

		if (query.length === 0) return;

		const filteredResults = cardData.filter(item =>
			item.title.startsWith(query)
		);

		if (filteredResults.length === 0) {
			const li = document.createElement('li');
			li.textContent = 'No se encontraron resultados.';
			li.style.cursor = 'default';
			searchResultsUl.appendChild(li);
			return;
		}

		filteredResults.forEach(item => {
			const li = document.createElement('li');
			li.textContent = item.title.charAt(0).toUpperCase() + item.title.slice(1);
			li.setAttribute('role', 'option');
			li.addEventListener('click', () => {
				openRecipeFocus(item.cardElement);
				searchContainer.setAttribute('aria-hidden', 'true');
				searchInput.value = '';
				searchResultsUl.innerHTML = '';
			});
			searchResultsUl.appendChild(li);
		});
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


// Ejecución de inicialización //
window.addEventListener('DOMContentLoaded', () => {
	initRecipeCards();
	loadFavorites();
	collectCardData();
});