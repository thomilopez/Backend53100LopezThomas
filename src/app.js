import express from 'express';
import handlebars from 'express-handlebars';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import viewsRouter from './routes/viewsRoutes.js';
import productsRouter from './routes/productsRoutes.js';
import cartsRouter from './routes/cartsRouter.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);


app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');


app.set('socketio', io);


app.use(express.static(path.join(__dirname, 'public')));


app.use(express.json());


app.use('/', viewsRouter);
app.use('/products', productsRouter);
app.use('/carts', cartsRouter);


io.on('connection', (socket) => {
    console.log('Usuario conectado');



    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
