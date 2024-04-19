import express from 'express';
import CartManagerNew from '../models/services/cartManagerNew.js'
import io from '../app.js';

const cartsRouter = express.Router();
const cartManager = new CartManagerNew();

cartsRouter.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        await cartManager.deleteProduct(cid, pid);
        res.json({ message: 'Producto eliminado del carrito exitosamente.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

cartsRouter.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const products = req.body.products;
        await cartManager.updateCart(cid, products);
        res.json({ message: 'Carrito actualizado exitosamente.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

cartsRouter.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        await cartManager.updateProductQuantity(cid, pid, quantity);
        res.json({ message: 'Cantidad de producto actualizada exitosamente.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }});


cartsRouter.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        await cartManager.deleteAllProducts(cid);
        res.json({ message: 'Todos los productos del carrito han sido eliminados.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


cartsRouter.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        io.emit('cartCreated', newCart);
        res.json(newCart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

cartsRouter.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartManager.getCartById(cartId);
        res.json(cart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;
        await cartManager.addProductToCart(cartId, productId, quantity);
        res.json({ message: 'Producto agregado al carrito exitosamente.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default cartsRouter;