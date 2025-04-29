const btn = document.getElementById('toggleBtn');
const status = document.getElementById('statusText');
const timerSelect = document.getElementById('timer');
const listaSitios = document.getElementById('listaSitios');
const inputSitio = document.getElementById('nuevoSitio');
const btnAgregar = document.getElementById('agregarSitio');
const listaSitiosContainer = document.getElementById('listaSitiosContainer');
const openMenuDeleteBlockSite = document.getElementById('openMenuDeleteBlockSite');

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
    listaSitiosContainer.style.display = sitios.length > 0 ? 'flex' : 'none';

    const li = document.createElement('li');
    li.textContent = site;

    const x = document.createElement('button');
    x.innerHTML = `
<svg class="deleteBlockedSiteBtn" xmlns="http://www.w3.org/2000/svg" fill="#fff" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="16" height="16">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
</svg>
    `;

    // Aplicar estilos dinámicos
    li.style.display = 'flex';
    li.style.alignItems = 'center';
    li.style.justifyContent = 'space-between';
    li.style.gap = '10px';
    li.style.backgroundColor = 'transparent';
    li.style.borderRadius = '8px';
    li.style.color = '#fff';
    li.style.fontSize = '14px';

    x.style.background = 'none';
    x.style.border = 'none';
    x.style.cursor = 'pointer';
    x.style.display = 'flex';
    x.style.alignItems = 'center';
    x.style.justifyContent = 'center';


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

x.addEventListener('mouseenter', async () => {
  openMenuDeleteBlockSite.style.display = 'flex';
})

init();
