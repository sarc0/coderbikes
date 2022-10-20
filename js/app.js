let stockProductos = [];
let carrito2 = [];
const mostrarProductos = (productos) => {
  productos.forEach((producto) => {
    const div = document.createElement("div");
    div.classList.add("producto");
    div.innerHTML = `
        <img src=${producto.img} class="img-prod" alt= "">
        <h3>${producto.nombre}</h3>
        <p class="precioProducto">Precio:$ ${producto.precio}</p>
        <button id="agregar${producto.id}" class="boton-agregar">Agregar <i class="fas fa-shopping-cart"></i></button>
        `;
    contenedorProductos.appendChild(div);
    const boton = document.getElementById(`agregar${producto.id}`);

    boton.addEventListener("click", () => {
      agregarAlCarrito(producto.id);
    });
  });
};
const controlador = async () => {
  try {
    const response = await fetch("../stock.json");
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error", error);
  }
};
const contenedorProductos = document.getElementById("contenedor-productos");

const contenedorCarrito = document.getElementById("carrito-contenedor");
const botonVaciar = document.getElementById("vaciar-carrito");
const contadorCarrito = document.getElementById("contadorCarrito");

const cantidad = document.getElementById("cantidad");
const precioTotal = document.getElementById("precioTotal");
const cantidadTotal = document.getElementById("cantidadTotal");

let carrito = [];

document.addEventListener("DOMContentLoaded", async () => {
  stockProductos = await controlador();
  mostrarProductos(stockProductos);
  if (localStorage.getItem("carrito")) {
    carrito = JSON.parse(localStorage.getItem("carrito"));
    actualizarCarrito();
  }
});
botonVaciar.addEventListener("click", () => {
  if (localStorage.length > 0) {
    Swal.fire({
      title: "¿Quieres vaciar el carrito?",
      text: "No se puede deshacer esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        carrito.length = 0;
        carrito2.length = 0;
        localStorage.clear();
        actualizarCarrito();
        Swal.fire("¡Carrito vacío!", "El carrito ha sido vaciado con éxito");
      }
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "¡Error!",
      text: "El carrito de compras se encuentra vacío",
      timer: 1500,
    });
  }
});

const agregarAlCarrito = (prodId) => {
  const item = stockProductos.find((prod) => prod.id === prodId);

  carrito2.push(item);
  const existe = carrito.some((prod) => prod.id === prodId);

  if (existe) {
    carrito.map((prod) => {
      if (prod.id === prodId) {
        prod.cantidad++;
      }
    });
  } else {
    carrito.push(item);
  }
  actualizarCarrito();

  Toastify({
    text: "¡Producto añadido al carrito!",
    style: {
      background: "linear-gradient(to left, #00b09b, #96c93d)",
    },
    duration: 1500,
  }).showToast();
};

const eliminarDelCarrito = (prodId) => {
  const item = carrito.find((prod) => prod.id === prodId);
  const item2 = carrito2.find((prod) => prod.id === prodId);
  const indice2 = carrito2.indexOf(item2);

  const indice = carrito.indexOf(item);
  carrito2.splice(indice2, 1);

  carrito.splice(indice, 1);
  actualizarCarrito();
  Toastify({
    text: "¡Producto eliminado del carrito!",
    style: {
      background: "#CB3234",
    },
    duration: 1500,
  }).showToast();
};

const actualizarCarrito = () => {
  contenedorCarrito.innerHTML = "";

  carrito.forEach((prod) => {
    const div = document.createElement("div");
    div.className = "productoEnCarrito";
    div.innerHTML = `
        <p>${prod.nombre}</p>
        <p>Precio:$${prod.precio}</p>
        <p>Cantidad: <span id="cantidad">${prod.cantidad}</span></p>
        <button onclick="eliminarDelCarrito(${prod.id})" class="boton-eliminar"><i class="fas fa-trash-alt"></i></button>
        `;

    contenedorCarrito.appendChild(div);

    localStorage.setItem("carrito", JSON.stringify(carrito));
  });
  contadorCarrito.innerText = carrito2.length;
  precioTotal.innerText = carrito.reduce(
    (acc, prod) => acc + prod.cantidad * prod.precio,
    0
  );
};
const comprar = document.getElementById("boton-comprar");
comprar.addEventListener("click", () => {
  if (localStorage.length > 0) {
    Swal.fire({
      icon: "success",
      title: "Felicidades",
      text: "¡Su compra ha sido realizada con éxito!",
      timer: 1500,
    });
    localStorage.clear();
    setTimeout(function () {
      location.reload();
    }, 3000);
  } else {
    Swal.fire({
      icon: "error",
      title: "¡Error!",
      text: "El carrito de compras se encuentra vacío",
      timer: 1500,
    });
  }
});
