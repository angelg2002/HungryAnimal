const colorAmber = '#b45309';

const hungryIcon = L.divIcon({
  className: 'custom-pin transition transform hover:scale-110 duration-300',
  // El HTML del SVG del pin
  html: `
    <div class="drop-shadow-lg drop-shadow-color-amber-500/50">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
        <path fill="${colorAmber}" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    </div>
  `,
  iconSize: [48, 48],
  iconAnchor: [24, 48], // La punta del pin queda en la coordenada
  popupAnchor: [0, -48] // El mensaje sale arriba del pin
});

const map = L.map('map', {
  zoomControl: false // Quitamos el control por defecto para moverlo abajo a la derecha
}).setView([4.6097, -74.0817], 14);

L.control.zoom({
  position: 'bottomright'
}).addTo(map);

// Cambio a un estilo de mapa más limpio y profesional (CartoDB Voyager)
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  subdomains: 'abcd',
}).addTo(map);

// Estilo del popup más moderno con las clases de Tailwind pre-existentes
const popupContent = `
    <div class="font-sans text-center min-w-[150px]">
        <h3 class="font-bold text-amber-700 text-lg mb-1">¡HungryAnimal!</h3>
        <p class="text-gray-600 text-sm m-0">Ayudando a los peluditos.</p>
    </div>
`;

L.marker([4.6097, -74.0817], { icon: hungryIcon }).addTo(map)
  .bindPopup(popupContent, {
    className: 'custom-professional-popup',
    closeButton: false
  })
  .openPopup();

// Un truco extra: disparar el redimensionado cuando la ventana cargue del todo
window.addEventListener('load', () => {
  setTimeout(() => {
    map.invalidateSize();
  }, 500);
});