const socket = io();

const listaProductos = document.getElementById("listaProductos");

socket.on("realTimeProducts", (lista) => {
  listaProductos.innerText = "";
  lista.forEach((prod) => {
    const producto = document.createElement("li");
    producto.innerText = prod.title;
    listaProductos.appendChild(producto);
  });
});
