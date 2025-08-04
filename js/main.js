const mesas = Array.from({ length: 15 }, (_, i) => ({ numero: i + 1, ocupada: false, pedido: [] }));
const agregado = Array.from({ length: 1 }, (_, i) => ({ numero: i + 1, ocupada: false, pedido: [] }));
const parallevar = Array.from({ length: 1 }, (_, i) => ({ numero: i + 1, ocupada: false, pedido: [] }));
let mesaSeleccionada = null;

function renderMesas() {
  const contenedor = document.getElementById('mesas');
  contenedor.innerHTML = '';
  mesas.forEach(mesa => {
    const div = document.createElement('div');
    div.className = 'mesa ' + (mesa.ocupada ? 'ocupada' : 'libre');
    div.innerText = 'Mesa ' + mesa.numero;
    div.onclick = () => seleccionarMesa(mesa.numero);
    contenedor.appendChild(div);
  });
}

function seleccionarMesa(numero) {
  document.querySelectorAll('.mesa').forEach(m => m.classList.remove('selected'));
  mesaSeleccionada = mesas.find(m => m.numero === numero);

  const indexMesa = mesas.findIndex(m => m.numero === numero);
  const todasLasMesas = document.querySelectorAll('.mesa');
  if (todasLasMesas[indexMesa]) {
    todasLasMesas[indexMesa].classList.add('selected');
  }

  document.getElementById('tituloMesa').innerText = 'Mesa ' + numero;
  document.getElementById('mesaSeleccionadaTexto').innerText = 'Mesa : ' + numero;

  if (mesaSeleccionada.ocupada) {
    document.getElementById('accionesMesa').classList.remove('hidden');
    mostrarComanda();
    document.getElementById('categorias').classList.add('hidden');
    document.getElementById('productos').classList.add('hidden');
  } else {
    document.getElementById('accionesMesa').classList.add('hidden');
    document.getElementById('modificarPedido').classList.add('hidden');
    mostrarCategorias();
  }
}

function seleccionarParaLlevar() {
  mesaSeleccionada = parallevar[0];
  document.getElementById('tituloMesa').innerText = 'Pedido para llevar';
  document.getElementById('mesaSeleccionadaTexto').innerText = 'Pedido para llevar';

  if (mesaSeleccionada.ocupada) {
    document.getElementById('accionesMesa').classList.remove('hidden');
    mostrarComanda();
    document.getElementById('categorias').classList.add('hidden');
    document.getElementById('productos').classList.add('hidden');
  } else {
    document.getElementById('accionesMesa').classList.add('hidden');
    document.getElementById('modificarPedido').classList.add('hidden');
    mostrarCategorias();
  }
}

function seleccionarAgregadoDeMesa() {
  mesaSeleccionada = agregado[0];
  document.getElementById('tituloMesa').innerText = 'Agregado de mesa';
  document.getElementById('mesaSeleccionadaTexto').innerText = 'Agregado de mesa';

  if (mesaSeleccionada.ocupada) {
    document.getElementById('accionesMesa').classList.remove('hidden');
    mostrarComanda();
    document.getElementById('categorias').classList.add('hidden');
    document.getElementById('productos').classList.add('hidden');
  } else {
    document.getElementById('accionesMesa').classList.add('hidden');
    document.getElementById('modificarPedido').classList.add('hidden');
    mostrarCategorias();
  }
}

function mostrarCategorias() {
  document.getElementById('categorias').classList.remove('hidden');
  document.getElementById('productos').classList.add('hidden');
  document.getElementById('accionesMesa').classList.add('hidden');
}

function mostrarProductos(categoria) {
  document.getElementById('tituloCategoria').innerText = categoria;
  const contenedor = document.getElementById('listaProductos');
  contenedor.innerHTML = '';

  productosPorCategoria[categoria].forEach(p => {
    const div = document.createElement('div');
    div.innerHTML = `${p.nombre} - $${p.precio} <button onclick='agregarProducto(${JSON.stringify(p)})'>Agregar</button>`;
    contenedor.appendChild(div);
  });

  document.getElementById('productos').classList.remove('hidden');
  document.getElementById('categorias').classList.add('hidden');
  document.getElementById('productos').scrollIntoView({ behavior: 'smooth' });
}

function mostrarPanelPrecios() {
  document.getElementById('panelPrecios').classList.remove('hidden');
  document.getElementById("btnGuardarCambios").style.display = "inline-block";
  document.getElementById("btnCerrarPanel").style.display = "inline-block";

  const contenedor = document.getElementById('listaCategoriasPrecios');
  contenedor.innerHTML = '';

  Object.keys(productosPorCategoria).forEach(categoria => {
    const catTitulo = document.createElement('h3');
    catTitulo.innerText = categoria;
    contenedor.appendChild(catTitulo);

    productosPorCategoria[categoria].forEach((producto, index) => {
      const inputId = `${categoria}-${index}`;
      const div = document.createElement('div');
      div.innerHTML = `
        ${producto.nombre}: 
        <input type="number" id="${inputId}" value="${producto.precio}" style="width:80px;">
      `;
      contenedor.appendChild(div);
    });
  });
}

function cerrarPanelPrecios() {
  document.getElementById("panelPrecios").classList.add("hidden");
  document.getElementById("btnGuardarCambios").style.display = "none";
  document.getElementById("btnCerrarPanel").style.display = "none";
}

function guardarPreciosLocal() {
  Object.keys(productosPorCategoria).forEach(categoria => {
    productosPorCategoria[categoria].forEach((producto, index) => {
      const inputId = `${categoria}-${index}`;
      const nuevoPrecio = parseInt(document.getElementById(inputId).value);
      if (!isNaN(nuevoPrecio)) {
        producto.precio = nuevoPrecio;
      }
    });
  });

  localStorage.setItem("preciosWaffles", JSON.stringify(productosPorCategoria));
  alert("Precios guardados localmente");
  document.getElementById('panelPrecios').classList.add('hidden');

  // Ocultar botones
  document.getElementById("btnGuardarCambios").style.display = "none";
  document.getElementById("btnCerrarPanel").style.display = "none";
}



// Iniciar la app
window.onload = () => {
  cargarPedidosDesdeFirestore(); // Viene de firebase.js
  renderMesas();
};
