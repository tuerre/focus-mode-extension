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

    const x = document.createElement('button');
    x.textContent = '❌';
    x.style.marginLeft = '10px';
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
  btn.style.backgroundColor = isOn ? '#da5353' : '#7eda53';
  btn.style.color = 'white';
}

init();
