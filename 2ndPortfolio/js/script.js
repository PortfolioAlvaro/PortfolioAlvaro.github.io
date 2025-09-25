const pageTurnBtn = document.querySelectorAll('.nextprev-btn');

pageTurnBtn.forEach((el, index) => {
    el.onclick = () => {
        const pageTurnId = el.getAttribute('data-page');
        const pageTurn = document.getElementById(pageTurnId);

        if (pageTurn.classList.contains('turn')) {
            pageTurn.classList.remove('turn');
            setTimeout(() => {
                pageTurn.style.zIndex = 20 - index;
            }, 500);
        }
        else {
            pageTurn.classList.add('turn');
            setTimeout (() => {
                pageTurn.style.zIndex = 20 + index;
            }, 500);
        }
    }
})

const pages = document.querySelectorAll('.book-page.page-right');
const contactMeBtn = document.querySelector('.btn.contact-me');

contactMeBtn.onclick = () => {
    pages.forEach((page, index) => {
        setTimeout(() => {
            page.classList.add('turn');

            setTimeout(() => {
                page.style.zIndex = 20 + 100;
            }, 500)
        }, (index + 1) * 200 + 100)
    })
}

let totalPages = pages.length;
let pageNumber = 0;

function reverseIndex() {
    pageNumber--;
    if (pageNumber < 0) {
        pageNumber = totalPages - 1;
    }
}


const backProfileBtn = document.querySelector('.back-profile');

backProfileBtn.onclick = () => {
    pages.forEach((_, index) => {
        setTimeout(() => {
            reverseIndex();
            pages[pageNumber].classList.remove('turn'); 

            setTimeout(() => {
            reverseIndex();
            pages[pageNumber].style.zIndex = 10 + index; 
        }, 500);
    }, (index + 1) * 200 + 100);
})
}

const coverRight = document.querySelector('.cover.cover-right');
const pageLeft = document.querySelector('.book-page.page-left');

setTimeout(() => {
    coverRight.classList.add('turn');
}, 2100)

setTimeout(() => {
    coverRight.style.zIndex = -1;
}, 2800)

setTimeout(() => {
    pageLeft.style.zIndex = 20;
}, 3200)

pages.forEach((_, index) => {
    setTimeout(() => {
        reverseIndex();
        pages[pageNumber].classList.remove('turn');

        setTimeout(() => {
            reverseIndex();
            pages[pageNumber].style.zIndex = 10 + index;
        }, 500)
    }, (index + 1) * 200 + 2100)
})

// Tema dark principal
const body = document.body;

// Lista de temas
const themes = ['root-dark'];
const themeNames = ['Oscuro'];

// Establecer el tema inicial como "Dark"
let currentThemeIndex = 0; // Índice del tema "root-dark"
body.classList.add(themes[currentThemeIndex]); // Agregar la clase inicial al body


// Inicializar EmailJS
(function(){
    emailjs.init("user_7jzYh3kJ3b4k5n6m7o8p9");
})();   

// Configuración del formulario de contacto
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Evita que la página se recargue

        emailjs.sendForm('service_jj352jb', 'template_c2kd7s7', this)
            .then(() => {
                alert('Mensaje enviado con éxito.');
            }, (error) => {
                alert('Hubo un error al enviar el mensaje: ' + error.text);
            });
    });
}

async function translateText(text, targetLang) {
    const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=es&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
    const data = await res.json();
    return data[0][0][0];
  }
  
  async function changeLanguage(lang) {
    const textNodes = getTextNodes(document.body);
    for (let node of textNodes) {
      const original = node.nodeValue.trim();
      if (original) {
        const translated = await translateText(original, lang);
        node.nodeValue = translated;
      }
    }
  }
  