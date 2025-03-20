const productos = [
    { id: 1, nombre: "Tenis", precio: 500, imagen: "imagenes/tenis.jpeg" },
    { id: 2, nombre: "Lámpara LED", precio: 300, imagen: "imagenes/luces led.jpg" },
    { id: 3, nombre: "Mochila", precio: 700, imagen: "imagenes/mochila.jpeg" }
];

let carrito = [];
const contenedorProductos = document.getElementById("productos");
const verCarrito = document.getElementById("verCarrito");
const inputBuscar = document.getElementById("buscar");
const btnBuscar = document.getElementById("btnBuscar");

// Mostrar productos
function cargarProductos(productosAMostrar = productos) {
    contenedorProductos.innerHTML = "";
    productosAMostrar.forEach(producto => {
        let div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h2>${producto.nombre}</h2>
            <p>Precio: $${producto.precio}</p>
            <button class="btn-comprar" onclick="comprarAhora(${producto.id})">Comprar</button>
            <button class="btn-comprar" onclick="agregarAlCarrito(${producto.id})">Agregar al Carrito</button>
        `;
        contenedorProductos.appendChild(div);
    });

    if (productosAMostrar.length < productos.length) {
        const btnVolver = document.createElement("button");
        btnVolver.textContent = "Volver a todos los artículos";
        btnVolver.classList.add("btn-comprar");
        btnVolver.onclick = () => cargarProductos(productos);
        contenedorProductos.appendChild(btnVolver);
    }
}

// Buscar productos
function buscarProductos() {
    const textoBusqueda = inputBuscar.value.toLowerCase();
    const productosFiltrados = productos.filter(producto => producto.nombre.toLowerCase().includes(textoBusqueda));
    cargarProductos(productosFiltrados);
}

// Comprar Ahora
function comprarAhora(id) {
    const producto = productos.find(p => p.id === id);
    alert(`Has comprado: ${producto.nombre} por $${producto.precio}`);
}

// Agregar al carrito
function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    carrito.push(producto);
    actualizarCarrito();
}

// Actualizar icono del carrito
function actualizarCarrito() {
    verCarrito.innerText = `🛒 (${carrito.length})`;
}

// Mostrar carrito con diseño mejorado
function mostrarCarrito() {
    let modal = document.getElementById("modalCarrito");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "modalCarrito";
        document.body.appendChild(modal);
    }

    let carritoHTML = "<h2>Carrito de Compras</h2>";
    if (carrito.length === 0) {
        carritoHTML += "<p>No hay productos en el carrito</p>";
    } else {
        carritoHTML += carrito.map((producto, index) => `
            <div class="carrito-item">
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <span>${producto.nombre} - $${producto.precio}</span>
                <button class="btn-eliminar" onclick="eliminarDelCarrito(${index})">❌</button>
            </div>
        `).join('');
    }
    carritoHTML += `<button class="btn-cerrar" onclick="cerrarCarrito()">Cerrar</button>`;

    modal.innerHTML = carritoHTML;
    modal.style.display = "block";
}

// Eliminar producto del carrito
function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    actualizarCarrito();
    mostrarCarrito();
}

// Cerrar modal del carrito
function cerrarCarrito() {
    const modal = document.getElementById("modalCarrito");
    if (modal) {
        modal.style.display = "none";
    }
}

// Eventos
verCarrito.addEventListener("click", mostrarCarrito);
btnBuscar.addEventListener("click", buscarProductos);
cargarProductos();