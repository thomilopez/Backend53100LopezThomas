import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import path from 'path';
import productsRouter from './routes/productsRouter.js';
import cartsRouter from './routes/cartsRouter.js';
import chatRouter from './routes/chatRouter.js';
import router from './routes/viewsRouter.js';
import __dirname from './utils.js';
import ProductManager from './models/ProductManager.js';
import mongoose from 'mongoose';
import ProductManagerNew from './models/services/productManagerNew.js';

const connectMongoDB = async () => {
    const DB_URL = 'mongodb://127.0.0.1:27017/ecommerce?retryWrites=true&w=majority'

    try{
        await mongoose.connect(DB_URL)
        console.log("Conectado con mongoDB")
    }catch(error){
        console.error("No se pudo conectar con MongoDB", error)
        process.exit()
    }
}

connectMongoDB()


const app = express();

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {

    console.log(`Servidor en ejecución en http://localhost:${PORT}`);

});

const io = new Server(server);

const productManager = new ProductManagerNew();



app.engine('handlebars',  handlebars.engine({
    layoutsDir: path.join(__dirname, 'views/layouts'),
    defaultLayout: 'main',
    extname: '.handlebars'
}));

app.set('view engine', 'handlebars');

app.set("views", path.join(__dirname, 'views'));

app.set('socketio', io);

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

app.use('/', router);

app.use('/products', productsRouter);

app.use('/carts', cartsRouter);

app.use('/chat', chatRouter);

io.on("connection", (socket) => {
    console.log("Usuario conectado");


    socket.on("disconnect", () => {
        console.log("Usuario desconectado");
    });

	socket.on('addProduct', async (product) => {
        try {
        const productAdded = await productManager.addProduct(product)
        console.log('Nuevo producto recibido:', product);   
        io.emit('addToTheList', productAdded)

        } catch (error) {
            console.error(error.message)
        }
    })
    socket.on('newMessage', (data) => {
        io.emit('newMessage', data); 
    });
});

export default { io };

