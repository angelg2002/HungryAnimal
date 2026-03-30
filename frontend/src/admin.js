document.addEventListener('DOMContentLoaded', () => {
  const inputCode = document.getElementById('coupon-code');
  const inputDiscount = document.getElementById('coupon-discount');
  const inputPhone = document.getElementById('customer-phone');
  const selectWACoupon = document.getElementById('wa-coupon-select');
  const textareaMessage = document.getElementById('wa-message');
  const tbodyCoupons = document.getElementById('coupons-table-body');
  const noCouponsMsg = document.getElementById('no-coupons-msg');

  // Leer cupones desde LocalStorage (simulación de base de datos para la UI)
  const coupons = JSON.parse(localStorage.getItem('hungryanimal_admin_coupons')) || [];

  // Renderizar cupones en la tabla y en el select
  function renderCoupons() {
    tbodyCoupons.innerHTML = '';
    selectWACoupon.innerHTML = '<option value="">-- No incluir cupón / Redactar mensaje libre --</option>';

    if (coupons.length === 0) {
      noCouponsMsg.style.display = 'block';
    } else {
      noCouponsMsg.style.display = 'none';
      coupons.forEach((coupon, index) => {
        const tr = document.createElement('tr');
        tr.className = 'border-b border-gray-100 hover:bg-orange-50/50 transition-colors';
        tr.innerHTML = `
                            <td class="px-6 py-4">
                                <span class="bg-orange-100 text-amber-900 font-black px-3 py-1 rounded-md border border-orange-200 shadow-sm">${coupon.code}</span>
                            </td>
                            <td class="px-6 py-4 font-medium text-gray-600">${coupon.discount}</td>
                            <td class="px-6 py-4 text-center">
                                <button onclick="deleteCoupon(${index})" class="text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors focus:ring-2 focus:ring-red-500/30" title="Eliminar cupón">
                                    <i class="fa-solid fa-trash-can"></i>
                                </button>
                            </td>
                        `;
        tbodyCoupons.appendChild(tr);

        const option = document.createElement('option');
        option.value = coupon.code;
        option.textContent = `${coupon.code} (${coupon.discount})`;
        selectWACoupon.appendChild(option);
      });
    }
  }

  // Eliminar cupón
  window.deleteCoupon = (index) => {
    if (confirm('¿Estás seguro de que deseas eliminar este código? Podría estar en uso por algún cliente.')) {
      coupons.splice(index, 1);
      localStorage.setItem('hungryanimal_admin_coupons', JSON.stringify(coupons));
      renderCoupons();
      updateMessagePreview();
    }
  };

  // Generar código aleatorio
  document.getElementById('btn-generate-random').addEventListener('click', () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'PROMO-';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    inputCode.value = code;
  });

  // Crear un nuevo cupón
  document.getElementById('btn-create-coupon').addEventListener('click', () => {
    const code = inputCode.value.trim().toUpperCase();
    const discount = inputDiscount.value.trim();

    if (!code || !discount) {
      alert('⚠️ Por favor ingresa el código del cupón y el descuento/regalo que otorgará.');
      return;
    }

    if (coupons.some(c => c.code === code)) {
      alert('🚫 Ese código ya existe en la lista de activos.');
      return;
    }

    coupons.push({ code, discount });
    localStorage.setItem('hungryanimal_admin_coupons', JSON.stringify(coupons));

    inputCode.value = '';
    inputDiscount.value = '';

    renderCoupons();
  });

  // Actualizar vista previa del mensaje de WhatsApp
  function updateMessagePreview() {
    const selectedCode = selectWACoupon.value;

    if (selectedCode) {
      const coupon = coupons.find(c => c.code === selectedCode);
      textareaMessage.value = `¡Hola! 👋 Te extrañamos en *HungryAnimal*.\n\nPuedes usar este código de descuento especial en tu próxima compra:\n👉 *${coupon.code}*\n\n¡Obtén un ${coupon.discount} ingresándolo en el carrito!\n\nVisítanos ahora: https://tusitio.com`;
    } else {
      textareaMessage.value = `¡Hola! 👋 Quería recordarte que en *HungryAnimal* tenemos lo mejor para tus mascotas.\n\nVisítanos: https://tusitio.com`;
    }
  }

  selectWACoupon.addEventListener('change', updateMessagePreview);

  // Enviar WhatsApp
  document.getElementById('btn-send-wa').addEventListener('click', () => {
    const phone = inputPhone.value.trim().replace(/\D/g, '');
    const msg = textareaMessage.value.trim();

    if (!phone) {
      alert('⚠️ Por favor ingresa el número de teléfono de tu cliente. Ej: 52 55 XXXX XXXX');
      return;
    }
    if (!msg) {
      alert('⚠️ El mensaje está vacío. Escribe algo antes de enviar.');
      return;
    }

    const encodedMsg = encodeURIComponent(msg);
    const url = `https://wa.me/${phone}?text=${encodedMsg}`;
    window.open(url, '_blank');
  });

  renderCoupons();
  updateMessagePreview();
});