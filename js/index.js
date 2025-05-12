/*JS PARA SECTION BANNER: */

let currentSlide = 0;
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === index);
    dots[i].classList.toggle("active", i === index);
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

// Cambia de imagen cada 4 segundos
setInterval(nextSlide, 4000);

// Permite cambiar al hacer clic en los puntitos
dots.forEach((dot, i) => {
  dot.addEventListener("click", () => {
    currentSlide = i;
    showSlide(i);
  });
});

/*JS PARA SECTION SUGERIDOS: */

const scrollContainer = document.querySelector('.productos-scroll');
const btnIzquierda = document.querySelector('.flecha.izquierda');
const btnDerecha = document.querySelector('.flecha.derecha');


btnIzquierda.addEventListener('click', () => {
  scrollContainer.scrollBy({
    left: -300,
    behavior: 'smooth'
  });
});


btnDerecha.addEventListener('click', () => {
  scrollContainer.scrollBy({
    left: 300,
    behavior: 'smooth'
  });
});

/*JS PARA SECTION FAQ: */

document.querySelectorAll('.faq-pregunta').forEach(item => {
  item.addEventListener('click', () => {
      const respuesta = item.nextElementSibling;
      const icon = item.querySelector('.faq-icon');

      respuesta.classList.toggle('active');
      item.classList.toggle('active');
  });
});