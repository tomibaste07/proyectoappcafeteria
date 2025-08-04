// Inicializar Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCoVKUYwFbFdNkf0iHm3K74QaJhtpa3rwA",
  authDomain: "pruebawaffles-96aed.firebaseapp.com",
  projectId: "pruebawaffles-96aed",
  storageBucket: "pruebawaffles-96aed.firebasestorage.app",
  messagingSenderId: "928079591770",
  appId: "1:928079591770:web:3ec53e9e788af524769b63"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Cargar pedidos guardados en Firestore al iniciar
function cargarPedidosDesdeFirestore() {
  db.collection("pedidos")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const nombreMesa = data.mesa;

        if (typeof nombreMesa === "string" && nombreMesa.startsWith("Mesa ")) {
          const numeroMesa = parseInt(nombreMesa.replace("Mesa ", ""));
          const mesa = mesas.find(m => m.numero === numeroMesa);
          if (mesa) {
            mesa.ocupada = true;
            mesa.pedido = data.items || [];
          }
        } else if (nombreMesa === "Para llevar") {
          parallevar[0].ocupada = true;
          parallevar[0].pedido = data.items || [];
        } else if (nombreMesa === "Agregado de mesa") {
          agregado[0].ocupada = true;
          agregado[0].pedido = data.items || [];
        }
      });

      renderMesas(); // renderiza después de cargar pedidos
    })
    .catch((error) => {
      console.error("Error al cargar pedidos:", error);
    });
}
