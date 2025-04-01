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

// Cambiar el tema de la página al hacer clic en el botón
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Lista de temas
const themes = ['root-dark', 'root2', 'root3', 'root', 'root-pastel', 'root-forest', 'root-sunset', 'root-ocean'];
const themeNames = ['Oscuro', 'Cálido', 'Frío', 'Minimalista', 'Pastel', 'Bosque', 'Atardecer', 'Océano'];

// Establecer el tema inicial como "Dark"
let currentThemeIndex = 0; // Índice del tema "root-dark"
body.classList.add(themes[currentThemeIndex]); // Agregar la clase inicial al body
themeToggle.textContent = `Tema: ${themeNames[currentThemeIndex]}`; // Actualizar el texto del botón

// Cambiar tema al hacer clic
themeToggle.addEventListener('click', () => {
    // Eliminar el tema actual
    body.classList.remove(themes[currentThemeIndex]);

    // Cambiar al siguiente tema
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;

    // Agregar el nuevo tema
    body.classList.add(themes[currentThemeIndex]);

    // Actualizar el texto del botón
    themeToggle.textContent = `Tema: ${themeNames[currentThemeIndex]}`;
})

const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Evita que la página se recargue

    emailjs.sendForm('service_jj352jb', 'template_c2kd7s7', this)
        .then(() => {
            alert('Mensaje enviado con éxito.');
        }, (error) => {
            alert('Hubo un error al enviar el mensaje: ' + error.text);
        })
})