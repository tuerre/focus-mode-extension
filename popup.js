const btn = document.getElementById('toggleBtn');
const status = document.getElementById('statusText');
const timerSelect = document.getElementById('timer');
const listaSitios = document.getElementById('listaSitios');
const inputSitio = document.getElementById('nuevoSitio');
const btnAgregar = document.getElementById('agregarSitio');

async function init() {
  const data = await chrome.storage.local.get(['focusMode', 'endTime', 'sitios']);
  updateUI(data.focusMode === true);
  mostrarSitios(data.sitios || []);
}

btn.addEventListener('click', async () => {
  const data = await chrome.storage.local.get(['focusMode']);
  const newState = !data.focusMode;
  const minutes = parseInt(timerSelect.value);
  let endTime = null;
  if (newState && minutes > 0) {
    endTime = Date.now() + minutes * 60 * 1000;
  }

  await chrome.storage.local.set({ focusMode: newState, endTime: endTime });
  updateUI(newState);
});

btnAgregar.addEventListener('click', async () => {
  const nuevo = inputSitio.value.trim();
  if (!nuevo) return;
  const data = await chrome.storage.local.get(['sitios']);
  const sitios = data.sitios || [];
  if (!sitios.includes(nuevo)) {
    sitios.push(nuevo);
    await chrome.storage.local.set({ sitios });
    mostrarSitios(sitios);
    inputSitio.value = '';
  }
});

function mostrarSitios(sitios) {
  listaSitios.innerHTML = '';
  sitios.forEach(site => {
    const li = document.createElement('li');
    li.textContent = site;
    li.style.marginBottom = '4px';
    li.style.listStyleType = 'none';

    const x = document.createElement('button');
    x.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="rgb(230, 25, 25)" viewBox="0 0 24 24" width="18" height="18">
  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
</svg>`;
    x.style.background = 'transparent';
    x.style.border = 'none';
    x.style.marginLeft = '2px';
    x.style.cursor = 'pointer';

    x.onclick = async () => {
      const nuevosSitios = sitios.filter(s => s !== site);
      await chrome.storage.local.set({ sitios: nuevosSitios });
      mostrarSitios(nuevosSitios);
    };

    li.appendChild(x);
    listaSitios.appendChild(li);
  });
}

function updateUI(isOn) {
  btn.textContent = isOn ? 'Desactivar' : 'Activar';
  btn.style.background = isOn ? 'linear-gradient(95.25deg, #201010 -25.47%, #341717 2.62%, #3e1818 114.98%)' : 'linear-gradient(95.25deg, #102011 -25.47%, #183417 2.62%, #1c3e18 114.98%)';
  btn.style.border = isOn ? '2px dashed #933939' : '2px dashed #409339';
}

init();
