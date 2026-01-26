const colorAmber = '#b45309';

const hungryIcon = L.divIcon({
  className: "custom-pin",
  // El HTML del SVG del pin
  html: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40">
      <path fill="${colorAmber}" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 40], // La punta del pin queda en la coordenada
  popupAnchor: [0, -40] // El mensaje sale arriba del pin
});

const map = L.map('map').setView([4.6097, -74.0817], 14);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19, // Te sugiero subirlo a 19 para ver mejor las calles
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

L.marker([4.6097, -74.0817], {icon: hungryIcon}).addTo(map)
    .bindPopup("<b>¡Bienvenidos a HungryAnimal!</b><br>Ayudando a los peluditos.")
    .openPopup();

// Un truco extra: disparar el redimensionado cuando la ventana cargue del todo
window.addEventListener('load', () => {
    setTimeout(() => {
        map.invalidateSize();
    }, 500);
});