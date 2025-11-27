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



/* Flipbook */

document.addEventListener('DOMContentLoaded', () => {
  colorDifficulty();
  initFlipBook('book-calientes', 'prev-btn-calientes', 'next-btn-calientes');
  initFlipBook('book-frias', 'prev-btn-frias', 'next-btn-frias');
});

function colorDifficulty() {
  const difficultySpans = document.querySelectorAll('.recipe-difficulty');

  difficultySpans.forEach(span => {
    const text = span.textContent.toLowerCase().trim();
    if (text.includes('fácil')) {
      span.classList.add('easy');
    } else if (text.includes('media')) {
      span.classList.add('medium');
    } else if (text.includes('difícil')) {
      span.classList.add('hard');
    }
  });
}

function initFlipBook(bookId, prevBtnId, nextBtnId) {
  const book = document.getElementById(bookId);
  if (!book) return;

  const papers = Array.from(book.querySelectorAll('.paper'));
  const prevBtn = document.getElementById(prevBtnId);
  const nextBtn = document.getElementById(nextBtnId);
  for (let i = 0; i < papers.length; i++) {
    papers[i].style.zIndex = (papers.length - i).toString();
  }
  let flippedCount = 0;
  nextBtn.addEventListener('click', () => {
    if (flippedCount >= papers.length) return;
    const p = papers[flippedCount];
    p.classList.add('flipped');
    p.style.zIndex = flippedCount + 1 + papers.length;

    flippedCount++;
  });

  prevBtn.addEventListener('click', () => {
    if (flippedCount <= 0) return;
    const p = papers[flippedCount - 1];
    p.classList.remove('flipped');
    p.style.zIndex = (papers.length - (flippedCount - 1)).toString();

    flippedCount--;
  });

  book.addEventListener('click', (e) => {

    if (e.target.closest('.controls') || e.target.closest('.btn')) return;
    if (flippedCount < papers.length) {
      nextBtn.click();
    } else { }
  });

  let hover = false;
  book.addEventListener('mouseenter', () => { hover = true; });
  book.addEventListener('mouseleave', () => { hover = false; });

  window.addEventListener('keydown', (ev) => {
    if (!hover) return;
    if (ev.key === 'ArrowRight') nextBtn.click();
    if (ev.key === 'ArrowLeft') prevBtn.click();
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