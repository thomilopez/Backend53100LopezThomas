import express from 'express'
import passport from 'passport'
import {
	getProductById,
	getProductsPaginated,
	addProduct,
	updateProduct,
	deleteProduct,
	getProducts,
} from '../controllers/controllersRouter/productController.js'
import AuthorizationMiddleware from '../middlewares/authorizationMiddleware.js'

const productsRouter = express.Router()

// Ruta para obtener la lista de productos paginada
productsRouter.get('/productspaginate', getProductsPaginated)

// Ruta para obtener todos los productos
productsRouter.get('/', getProducts)

// Ruta para obtener un producto por su ID
productsRouter.get('/:pid', getProductById)

// Ruta para crear un nuevo producto (solo accesible para administradores)
productsRouter.post(
	'/',
	passport.authenticate('jwt', { session: false }),
	AuthorizationMiddleware.isAdmin,
	addProduct,
)

// Ruta para actualizar un producto (solo accesible para administradores)
productsRouter.patch(
	'/:pid',
	passport.authenticate('jwt', { session: false }),
	AuthorizationMiddleware.isAdmin,
	updateProduct,
)

// Ruta para eliminar un producto (solo accesible para administradores)
productsRouter.delete(
	'/:pid',
	passport.authenticate('jwt', { session: false }),
	AuthorizationMiddleware.isAdmin,
	deleteProduct,
)

export default productsRouter
