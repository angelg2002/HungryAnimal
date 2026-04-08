document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    if(totalSlides === 0) return;

    function showSlide(index) {
        // Ocultar todos
        slides.forEach(slide => {
            slide.classList.replace('opacity-100', 'opacity-0');
            slide.classList.replace('z-10', 'z-0');
        });
        dots.forEach(dot => {
            dot.classList.replace('bg-lime-800', 'bg-lime-800/40');
        });
        
        // Mostrar el seleccionado
        slides[index].classList.replace('opacity-0', 'opacity-100');
        slides[index].classList.replace('z-0', 'z-10');
        dots[index].classList.replace('bg-lime-800/40', 'bg-lime-800');
        
        currentSlide = index;
    }
    
    // Iniciar intervalo de 3 segundos (3000 ms)
    let slideInterval = setInterval(() => { showSlide((currentSlide + 1) % totalSlides); }, 3000);
    
    // Permitir navegación manual con los puntos
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(slideInterval); // Pausar auto-rotación al tocar
            showSlide(index);
            slideInterval = setInterval(() => { showSlide((currentSlide + 1) % totalSlides); }, 3000);
        });
    });
});