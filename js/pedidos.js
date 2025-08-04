function agregarProducto(producto) {
  const aclaracion = prompt("Aclaración para este ítem (opcional):", "");
  mesaSeleccionada.pedido.push({ ...producto, aclaracion });
  mostrarComanda();
}

function mostrarComanda() {
  const lista = document.getElementById('listaPedido');
  lista.innerHTML = '';
  mesaSeleccionada.pedido.forEach((p, index) => {
    const div = document.createElement('div');
    div.className = 'pedido-item';
    div.innerHTML = `${p.nombre} - $${p.precio}<br><small>${p.aclaracion || ''}</small> <button onclick="eliminarItem(${index})">❌</button>`;
    lista.appendChild(div);
  });
  document.getElementById('modificarPedido').classList.remove('hidden');
}

function eliminarItem(index) {
  mesaSeleccionada.pedido.splice(index, 1);
  mostrarComanda();
}

function finalizarPedido() {
  mesaSeleccionada.ocupada = true;

  let nombreMesa;
  if (mesas.includes(mesaSeleccionada)) {
    nombreMesa = `Mesa ${mesaSeleccionada.numero}`;
  } else if (mesaSeleccionada === parallevar[0]) {
    nombreMesa = 'Para llevar';
  } else if (mesaSeleccionada === agregado[0]) {
    nombreMesa = 'Agregado de mesa';
  }

  const pedidoData = {
    mesa: nombreMesa,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    items: mesaSeleccionada.pedido.map(p => ({
      nombre: p.nombre,
      precio: p.precio,
      aclaracion: p.aclaracion || null
    }))
  };

  db.collection("pedidos")
    .where("mesa", "==", nombreMesa)
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        docRef.update(pedidoData)
          .then(() => {
            alert('Pedido actualizado para ' + nombreMesa);
            renderMesas();
            document.getElementById('categorias').classList.add('hidden');
            document.getElementById('productos').classList.add('hidden');
          })
          .catch(error => {
            console.error("Error al actualizar pedido:", error);
            alert("Error al actualizar pedido. Ver consola.");
          });
      } else {
        db.collection("pedidos")
          .add(pedidoData)
          .then(() => {
            alert('Pedido guardado para ' + nombreMesa);
            renderMesas();
            document.getElementById('categorias').classList.add('hidden');
            document.getElementById('productos').classList.add('hidden');
          })
          .catch(error => {
            console.error("Error al guardar pedido:", error);
            alert("Error al guardar pedido. Ver consola.");
          });
      }
    })
    .catch(error => {
      console.error("Error al verificar existencia de pedido:", error);
    });
}

function generarTicket() {
  let total = 0;
  let titulo;
  if (mesas.includes(mesaSeleccionada)) {
    titulo = `Mesa ${mesaSeleccionada.numero}`;
  } else if (mesaSeleccionada === parallevar[0]) {
    titulo = 'Pedido para llevar';
  } else if (mesaSeleccionada === agregado[0]) {
    titulo = 'Agregado de mesa';
  }

  let detalle = `${titulo}\n-------------------------\n`;
  mesaSeleccionada.pedido.forEach(p => {
    detalle += `${p.nombre}\n`;
    if (p.aclaracion) detalle += `  (${p.aclaracion})\n`;
    detalle += `  $${p.precio}\n\n`;
    total += p.precio;
  });
  detalle += `-------------------------\nTotal: $${total}`;
  return detalle;
}

function generarTicket2() {
  let titulo = mesas.includes(mesaSeleccionada) ? `Mesa ${mesaSeleccionada.numero}` :
    (mesaSeleccionada === parallevar[0] ? 'Pedido para llevar' : 'Agregado de mesa');
  let detalle = `${titulo}\n-------------------------\n`;

  mesaSeleccionada.pedido.forEach(p => {
    detalle += `${p.nombre}\n`;
    if (p.aclaracion) detalle += `  (${p.aclaracion})\n`;
    detalle += `\n`;
  });

  return detalle;
}

function imprimirTicket() {
  let contenido = generarTicket();
  let ventana = window.open('width=500,height=500');
  ventana.document.write(`<pre>${contenido}</pre>`);
  ventana.print();
}

function imprimirTicketparacocina() {
  let contenido = generarTicket2();
  let ventana = window.open('width=500,height=500');
  ventana.document.write(`<pre>${contenido}</pre>`);
  ventana.print();
}

function cobrarMesa() {
  alert(generarTicket());

  let nombreMesa;
  if (mesas.includes(mesaSeleccionada)) {
    nombreMesa = `Mesa ${mesaSeleccionada.numero}`;
  } else if (mesaSeleccionada === parallevar[0]) {
    nombreMesa = 'Para llevar';
  } else if (mesaSeleccionada === agregado[0]) {
    nombreMesa = 'Agregado de mesa';
  }

  db.collection("pedidos")
    .where("mesa", "==", nombreMesa)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        db.collection("pedidos").doc(doc.id).delete();
      });
    })
    .catch((error) => {
      console.error("Error al eliminar pedido de Firestore:", error);
    });

  mesaSeleccionada.ocupada = false;
  mesaSeleccionada.pedido = [];
  renderMesas();
  document.getElementById('accionesMesa').classList.add('hidden');
}
