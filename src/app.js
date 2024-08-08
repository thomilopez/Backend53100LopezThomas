import express from 'express'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import path from 'node:path'
import passport from 'passport'
import MongoStore from 'connect-mongo'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import nodemailer from 'nodemailer'
import twilio from 'twilio'
import compression from 'express-compression'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUiExpress from 'swagger-ui-express'
import productsRouter from './routes/productsRouter.js'
import cartsRouter from './routes/cartsRouter.js'
import chatRouter from './routes/chatRouter.js'
import userRouter from './routes/userRouter.js'
import router from './routes/viewsRouter.js'
import __dirname from './utils.js'
import ProductManagerNew from './controllers/productManagerNew.js'
import sessionRouter from './routes/sessions.router.js'
import initializePassport from './config/passaportConfig.js'
import { entorno } from './config/config.js'
import MongoSingleton from './persistencia/mongoSingleton.js'
import errorHandler from './middlewares/errorHandler.js'
import logger, { addLogger } from './middlewares/logger.js'

const productManager = new ProductManagerNew()
const DB_URL2 = entorno.mongoURL
// Crear aplicación Express
const app = express()
app.disable('x-powered-by')
const PORT = entorno.port

// Configuración de socket.io
const server = app.listen(PORT, () => {
	logger.info(`Servidor en ejecución en http://localhost:${PORT}`)
})
const io = new Server(server)

// Configuracion de swagger

const swaggerOptions = {
	definition: {
		openapi: '3.0.1',
		info: {
			title: 'API de productos',
			description: 'API de productos',
		},
	},
	apis: [`${__dirname}/docs/**/*.yaml`],
}

const specs = swaggerJSDoc(swaggerOptions)

app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

// Middleware y configuraciones
app.use(compression())
app.engine(
	'handlebars',
	handlebars.engine({
		layoutsDir: path.join(__dirname, 'views/layouts'),
		defaultLayout: 'main',
		extname: '.handlebars',
	}),
)
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'))
app.set('socketio', io)
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(cookieParser())
app.use(errorHandler)
// Configuración de sesiones
app.use(
	session({
		store: MongoStore.create({
			mongoUrl: DB_URL2,
			ttl: 15,
		}),
		secret: 'hola',
		resave: false,
		saveUninitialized: false,
	}),
)

MongoSingleton.getInstance()

// Inicializa y usa passport con sesiones
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

//twilio
const client = twilio(process.env.TWILIO_SSID, process.env.AUTH_TOKEN)
//nodemailer
const mailOptions = {
	service: 'gmail',
	host: 'smtp.gmail.com',
	secure: false,
	port: 587,
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASS,
	},
}
const transport = nodemailer.createTransport(mailOptions)

//mail route
app.get('/mail', async (req, res) => {
	const result = await transport.sendMail({
		from: `Correo de prueba <${process.env.MAIL_USER}>`,
		to: `${process.env.MAIL_USER}`,
		subject: 'Correo de prueba',
		html: `<div>
                <h1>CORREO TEST</h1>
                <p>Correo sin adjunto</p>
            </div>`,
	})
	res.send('Correo enviado')
})
app.get('/mail-adjunto', async (req, res) => {
	const result = await transport.sendMail({
		from: `Correo de prueba <${process.env.MAIL_USER}>`,
		to: `${process.env.MAIL_USER}`,
		subject: 'Correo de prueba',
		html: `<div>
                <h1>CORREO TEST</h1>
                <p>Correo con adjunto</p>
            </div>`,
		attachments: [
			{
				filename: 'img1.jpg',
				path: `${__dirname}/public/img/img1.jpg`,
				cid: 'img1',
			},
		],
	})
	res.send('Correo enviado')
})

//sms
app.get('/sms', async (req, res) => {
	const { message } = req.body
	const result = await client.messages.create({
		body: 'hola',
		to: process.env.PHONE_NUMBER_TO, //cliente
		from: process.env.PHONE_NUMBER, //numero de twilio
	})
	res.send('Mensaje enviado')
})
// Middleware para manejar errores de autenticación de Passport
app.use((err, req, res, next) => {
	if (err) {
		logger.error(err)
		res.status(401).json({ error: 'Error de autenticación' })
	}
})

// Rutas
app.use(addLogger)
app.use('/', router)
app.use('/api', userRouter)
app.use('/api/products', productsRouter)
app.use('/api/sessions', sessionRouter)
app.use('/api/carts', cartsRouter)
app.use('/chat', chatRouter)

// Configuración de socket.io
io.on('connection', (socket) => {
	logger.info('Usuario conectado')
	socket.on('disconnect', () => {
		logger.info('Usuario conectado')
	})
	socket.on('addProduct', async (product) => {
		try {
			const productAdded = await productManager.addProduct(product)
			logger.info('Nuevo producto recibido:', product)
			io.emit('addToTheList', productAdded)
		} catch (error) {
			logger.error(error.message)
		}
	})
	socket.on('newMessage', (data) => {
		io.emit('newMessage', data)
	})
})
export default io
