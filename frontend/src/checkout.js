function resumenCompra() {

  const contenedor = document.getElementById('contenedor-checkout');

  if (!contenedor) return;

  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

  if (carrito.length === 0) {
    contenedor.innerHTML = `<p class="text-center text-2xl text-gray-700 font-bold">
                Tu carrito está vacío.
            </p>`;
    return;
  }

  let html = `
    <h2 class="text-3xl text-center font-bold mb-6 text-lime-800 tracking-tight">Resumen de tu compra</h2>
    <div class="flex flex-col gap-4">
`;


  carrito.forEach(item => {
    html += `
        <div class="overflow-x-auto flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl border-2 border-lime-800/70 shadow ">
                <div class="flex gap-4 items-center">
                    <img src="${item.img}" class="w-20 h-20 object-cover rounded-lg">
                    <div>
                        <h3 class="font-bold">${item.nombre}</h3>
                        <p>Cantidad: <span class="font-bold">${item.cantidad}</span></p>
                    </div>
                </div>
                <h4 class="font-bold text-lime-800 text-xl">$${(item.precio * item.cantidad).toLocaleString()}</h4>
            </div>`;
  });
  html += `</div>`;
  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  html += `
        <div class="w-full h-1/4 overflow-x-auto mt-8 p-6 bg-white text-lime-800/75 rounded-xl font-bold border">
            Total: $${total.toLocaleString()}
        </div>
    `;

  contenedor.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', () => {
  resumenCompra();
  initDeliveryOptions();
  initAddressForm();
  loadConfirmedAddress();
});

function initAddressForm() {
  const addressForm = document.getElementById('address-form');
  if (addressForm) {
    // 1) Cargar info previa si existe (cuando el usuario vuelve para "Editar")
    const currentData = localStorage.getItem('hungryanimal_address');
    if (currentData) {
      const address = JSON.parse(currentData);
      document.getElementById('address-street').value = address.street || '';
      document.getElementById('address-city').value = address.city || '';
      document.getElementById('address-name').value = address.name || '';
    }

    // 2) Guardar al hacer submit
    addressForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const street = document.getElementById('address-street').value.trim();
      const city = document.getElementById('address-city').value.trim();
      const name = document.getElementById('address-name').value.trim();

      localStorage.setItem('hungryanimal_address', JSON.stringify({ street, city, name }));
      window.location.href = 'checkout.html';
    });
  }
}

function loadConfirmedAddress() {
  const container = document.getElementById('confirmed-address-container');
  if (!container) return;

  const addressData = localStorage.getItem('hungryanimal_address');
  if (addressData) {
    const address = JSON.parse(addressData);
    document.getElementById('display-address-name').textContent = address.name || '';
    document.getElementById('display-address-street').textContent = address.street || '';
    document.getElementById('display-address-city').textContent = address.city || '';
    container.style.display = 'block';
  } else {
    // Redirigir a direccion.html si no hay dirección guardada?
    // window.location.href = 'direccion.html'; // Removido para debugging, pero podría añadirse
  }
}

function initDeliveryOptions() {
  const dateSelect = document.getElementById('delivery-date');
  const timeSelect = document.getElementById('delivery-time');

  if (!dateSelect || !timeSelect) return;

  // Time frame starts 2 days from the actual day
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 2);

  // Populate dates (7 next available days)
  for (let i = 0; i < 7; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);

    const option = document.createElement('option');
    option.value = d.toISOString().split('T')[0];

    // Formatear: ej. "Miércoles, 1 de noviembre"
    const formatter = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
    let dateString = formatter.format(d);
    // Capitalizar primera letra
    dateString = dateString.charAt(0).toUpperCase() + dateString.slice(1);

    option.textContent = dateString;
    dateSelect.appendChild(option);
  }

  // Populate available time block windows
  const hours = [
    '09:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '12:00 PM - 01:00 PM',
    '01:00 PM - 02:00 PM',
    '02:00 PM - 03:00 PM',
    '03:00 PM - 04:00 PM',
    '04:00 PM - 05:00 PM',
    '05:00 PM - 06:00 PM',
  ];

  hours.forEach(hourBlock => {
    const option = document.createElement('option');
    option.value = hourBlock;
    option.textContent = hourBlock;
    timeSelect.appendChild(option);
  });
}

function procesarPago() {
  try {
      const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));
      const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

      // Si el usuario está logueado y tiene productos, intentamos guardar la orden
      // Hacemos el fetch en segundo plano (sin "await") para NO congelar la pantalla
      if (usuarioActivo && usuarioActivo.id && carrito.length > 0) {
          const totalCompra = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
          const ordenData = {
              usuarioId: Number(usuarioActivo.id),
              productos: carrito,
              total: totalCompra
          };
          
          fetch('https://hungry-animal-api.onrender.com/api/ordenes', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(ordenData)
          }).catch(err => console.log('Error de fondo en orden:', err));
      }
      
      // Redirigimos INMEDIATAMENTE a la vista final sin importar la respuesta del servidor
      localStorage.removeItem('carrito');
      window.location.href = 'pago-exitoso.html';
  } catch (error) {
      console.error('Error procesando el pago:', error);
      window.location.href = 'pago-exitoso.html';
  }
}

// Exponemos la función al entorno global (window)
window.procesarPago = procesarPago;