const express = require('express');
const cartsRouter = express.Router();
const CartManager = require('../CartManager');
const cartManager = new CartManager('cart.json');

cartsRouter.post('/', async (req, res) => {
    try {
        const newCart = req.body;
        await cartManager.createCart(newCart);
        res.json({ message: 'Carrito creado exitosamente.' });
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

module.exports = cartsRouter;