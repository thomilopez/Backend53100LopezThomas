import express from 'express';
import {
    deleteProductFromCart,
    updateCart,
    updateProductQuantity,
    deleteAllProducts,
    createCart,
    getCartById,
    addProductToCart,
    purchaseCart,
} from "../controllers/controllersRouter/cartController.js"
import AuthorizationMiddleware from '../middlewares/authorizationMiddleware.js';

const cartsRouter = express.Router();

// Ruta para eliminar un producto del carrito
cartsRouter.delete('/:cid/products/:pid', AuthorizationMiddleware.isUser, deleteProductFromCart);

// Ruta para actualizar el carrito
cartsRouter.put('/:cid', AuthorizationMiddleware.isUser, updateCart);

// Ruta para actualizar la cantidad de un producto en el carrito
cartsRouter.put('/:cid/products/:pid', AuthorizationMiddleware.isUser, updateProductQuantity);

// Ruta para eliminar todos los productos del carrito
cartsRouter.delete('/:cid', AuthorizationMiddleware.isUser, deleteAllProducts);

// Ruta para crear un nuevo carrito
cartsRouter.post('/', AuthorizationMiddleware.isUser, createCart);

// Ruta para obtener un carrito por su ID
cartsRouter.get('/:cid', AuthorizationMiddleware.isUser, getCartById);

// Ruta para agregar un producto al carrito
cartsRouter.post('/:cid/product/:pid', AuthorizationMiddleware.isUser, addProductToCart);


cartsRouter.post('/:cid/purchase', AuthorizationMiddleware.isUser, purchaseCart);

export default cartsRouter;
