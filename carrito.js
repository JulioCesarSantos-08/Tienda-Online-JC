const productos = [
    { id: 1, nombre: "Tenis", precio: 500, imagen: "imagenes/tenis.jpeg" },
    { id: 2, nombre: "Lámpara LED", precio: 150, imagen: "imagenes/luces led.jpg" },
    { id: 3, nombre: "Mochila", precio: 250, imagen: "imagenes/mochila.jpeg" },
    { id: 4, nombre: "Casa para moto", precio: 400, imagen: "imagenes/Sombramoto.jpg" },
    { id: 5, nombre: "Lámpara solar", precio: 200, imagen: "imagenes/laparasolar.jpeg" }
];

let carrito = [];
const contenedorProductos = document.getElementById("productos");
const verCarrito = document.getElementById("verCarrito");
const inputBuscar = document.getElementById("buscar");
const btnBuscar = document.getElementById("btnBuscar");
const btnVoz = document.getElementById("btnVoz"); // Botón de búsqueda por voz

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

// Buscar productos con teclado
function buscarProductos() {
    const textoBusqueda = inputBuscar.value.toLowerCase();
    const productosFiltrados = productos.filter(producto => producto.nombre.toLowerCase().includes(textoBusqueda));
    cargarProductos(productosFiltrados);
}

// Búsqueda por voz usando Web Speech API
function buscarPorVoz() {
    const reconocimiento = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    reconocimiento.lang = "es-ES"; // Configurar idioma español

    reconocimiento.onstart = function () {
        btnVoz.textContent = "Escuchando...";
        btnVoz.disabled = true;
    };

    reconocimiento.onresult = function (event) {
        const texto = event.results[0][0].transcript;
        inputBuscar.value = texto;
        buscarProductos(); // Realiza la búsqueda con el texto reconocido
    };

    reconocimiento.onerror = function () {
        alert("No se pudo reconocer la voz. Inténtalo de nuevo.");
    };

    reconocimiento.onend = function () {
        btnVoz.textContent = "🎤";
        btnVoz.disabled = false;
    };

    reconocimiento.start();
}

// Comprar Ahora (lleva a WhatsApp con solo 1 producto)
function comprarAhora(id) {
    const producto = productos.find(p => p.id === id);
    const mensaje = `Hola, quiero comprar el siguiente producto:\n- ${producto.nombre} por $${producto.precio}`;
    const url = `https://wa.me/message/ZQROKPMTPKWJB1?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
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

// Mostrar carrito con botón "Comprar Todos"
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

        carritoHTML += `
            <button class="btn-comprar-todos" onclick="comprarTodos()">Comprar Todos</button>
        `;
    }
    
    carritoHTML += `<button class="btn-cerrar" onclick="cerrarCarrito()">Cerrar</button>`;

    modal.innerHTML = carritoHTML;
    modal.style.display = "block";
}

// Comprar todos los productos del carrito en WhatsApp
function comprarTodos() {
    if (carrito.length === 0) return;

    let mensaje = "Hola, quiero comprar los siguientes productos:\n";
    carrito.forEach(producto => {
        mensaje += `- ${producto.nombre} por $${producto.precio}\n`;
    });

    const url = `https://wa.me/message/ZQROKPMTPKWJB1?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
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
btnVoz.addEventListener("click", buscarPorVoz); // Evento para búsqueda por voz
cargarProductos();