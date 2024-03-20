import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import path from 'path';
import productsRouter from './routes/productsRouter.js';
import cartsRouter from './routes/cartsRouter.js';
import router from './routes/viewsRouter.js';
import __dirname from './utils.js';

const app = express();

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {

    console.log(`Servidor en ejecución en http://localhost:${PORT}`);

});

const io = new Server(server);




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

io.on("connection", (socket) => {
    console.log("Usuario conectado");

    socket.on("disconnect", () => {
        console.log("Usuario desconectado");
    });

	socket.on('addProduct', async (product) => {
        try {
        const productAdded = await ProductManager.addProduct(product)
        console.log('Nuevo producto recibido:', product);   
        io.emit('addToTheList', productAdded)

        } catch (error) {
            console.error(error.message)
        }
    })
});


