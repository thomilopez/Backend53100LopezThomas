import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import path from 'path';
import productsRouter from './routes/productsRouter.js';
import cartsRouter from './routes/cartsRouter.js';
import chatRouter from './routes/chatRouter.js';
import router from './routes/viewsRouter.js';
import __dirname from './utils.js';
// import ProductManager from './models/ProductManager.js';
import mongoose from 'mongoose';
import ProductManagerNew from './models/services/productManagerNew.js';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import FileStore from 'session-file-store';
import sessionRouter from './routes/sessions.router.js';
import passport from 'passport';
import initializePassport from './config/passaportConfig.js';



const connectMongoDB = async () => {
    const DB_URL = 'mongodb+srv://thomasignaciolopez:Vzj0a0fdqqLm9SsI@cluster0.0p9eir3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

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

const fileStorage = FileStore(session);

const server = app.listen(PORT, () => {

    console.log(`Servidor en ejecución en http://localhost:${PORT}`);

});

const io = new Server(server);

const productManager = new ProductManagerNew();

const DB_URL2 = 'mongodb+srv://thomasignaciolopez:Vzj0a0fdqqLm9SsI@cluster0.0p9eir3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'




app.engine('handlebars',  handlebars.engine({
    layoutsDir: path.join(__dirname, 'views/layouts'),
    defaultLayout: 'main',
    extname: '.handlebars'
}));

app.set('view engine', 'handlebars');



app.set("views", path.join(__dirname, 'views'));

app.set('socketio', io);

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

app.use(
        session({
        //store: new fileStorage({ path: "./sessions", ttl: 10, retries: 0 }),
        store: MongoStore.create({
            mongoUrl: DB_URL2,
            ttl: 15,
        }),
        secret: "hola",
        resave: false,
        saveUninitialized: false,
        })
    );

// //usando passport
// initializePassport()
// app.use(passport.initialize())
// app.use(passport.session())

app.use('/', router);

app.use('/api/products', productsRouter);

app.use('/api/sessions', sessionRouter);

app.use('/api/carts', cartsRouter);

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

