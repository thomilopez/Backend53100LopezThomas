import express from 'express';
import { getProductById, getProductsPaginated, addProduct, updateProduct, deleteProduct } from '../controllers/controllersRouter/productController.js';
import AuthorizationMiddleware from '../middlewares/authorizationMiddleware.js';
const productsRouter = express.Router();

// Ruta para obtener la lista de productos paginada
productsRouter.get('/', getProductsPaginated);

// Ruta para obtener un producto por su ID
productsRouter.get('/:pid', getProductById);

// Ruta para crear un nuevo producto
productsRouter.post('/', AuthorizationMiddleware.isAdmin, addProduct);

// Ruta para actualizar un producto
productsRouter.put('/:pid', AuthorizationMiddleware.isAdmin, updateProduct);

// Ruta para eliminar un producto
productsRouter.delete('/:pid', AuthorizationMiddleware.isAdmin, deleteProduct);

export default productsRouter;

