
const socket = io();

socket.on("productos", (data) => {
    renderProductos(data);
}); 

//Función para renderizar la tabla de productos:
const renderProductos = (productos) => {
    const contenedorProductos = document.getElementById("contenedorProductos");
    contenedorProductos.innerHTML = "";


    productos.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("card");
        //Agregamos boton para eliminar: 
        card.innerHTML = `
                <p>ID del Producto: ${item.id}</p>
                <h2>Bodega: ${item.title}</h2>
                <p>Vino: ${item.description}</p>
                <p>Codigo: ${item.code}</p>
                <p>Precio: ${item.price}</p>
                <p>Estado: ${item.status}</p>
                <p>Stock: ${item.stock}</p>
                <p>Tipo: ${item.category}</p>
                <p>Imagen: ${item.thumbnails}</p>
                <button> Eliminar Producto </button>
        
        `;
        contenedorProductos.appendChild(card);

        //Agrego el evento eliminar producto:
        card.querySelector("button").addEventListener("click", () => {
            eliminarProducto(item.id);
        });
    });
}

//Eliminar producto: 
const eliminarProducto = (id) => {
    socket.emit("eliminarProducto", id);
}

//Agregar producto:

document.getElementById("btnEnviar").addEventListener("click", () => {
    agregarProducto();
});


const agregarProducto = () => {
    const producto = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        img: document.getElementById("img").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        status: document.getElementById("status").value === "true"
    };
    
    socket.emit("agregarProducto", producto);
};