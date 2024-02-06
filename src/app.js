const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const socket = require("socket.io");
const PUERTO = 8080;


const productsRouter = require("./routes/products.routes.js");
const cartsRouter = require("./routes/carts.routes.js");
const viewsRouter = require("./routes/views.routes.js");

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./src/public"));

//Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Rutas: 
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

const server = app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});

//Obtengo el array de productos:
const ProductManager = require("./controllers/product-manager.js");
const productManager = new ProductManager("./src/models/productos.json");


const io = socket(server);

io.on("connection", async (socket) => {
    console.log("Nuevo cliente conectado");

    //Enviamos el array de productos al cliente que se conectó:
    socket.emit("productos", await productManager.getProducts());    
    
    //Recibimos el evento "eliminarProducto" desde el cliente:
    socket.on("eliminarProducto", async (id) => {
        await productManager.deleteProduct(id);
        //Enviamos el array de productos actualizado a todos los productos:
        io.sockets.emit("productos", await productManager.getProducts());
    });

    //Recibimos el evento "agregarProducto" desde el cliente:
    socket.on("agregarProducto", async (producto) => {
        await productManager.addProduct(producto);
        //Enviamos el array de productos actualizado a todos los productos:
        io.sockets.emit("productos", await productManager.getProducts());
    });
});