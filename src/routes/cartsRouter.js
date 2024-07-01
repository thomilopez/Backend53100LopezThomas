import express from 'express';
import CartManagerNew from '../controllers/cartManagerNew.js';
import io from '../app.js';
import TicketModel from '../controllers/ticketManager.js';


const ticketManager = new TicketModel();
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


cartsRouter.post('/:cid/purchase', async (req, res) => {
    const cartId = req.params.cid;

    try {
        // Obtener el carrito desde la base de datos
        const cart = await cartManager.findByCartId(cartId);

        // Verificar el stock de cada producto en el carrito
        const productsToUpdate = [];
        const productsNotPurchased = [];

        for (const product of cart.products) {
            const productInStock = await ProductRepository.findById(product.productId);

            if (productInStock.stock >= product.quantity) {
                // Restar la cantidad comprada del stock disponible
                productInStock.stock -= product.quantity;
                productsToUpdate.push(productInStock);
            } else {
                productsNotPurchased.push(product.productId);
            }
        }

        if (productsToUpdate.length === cart.products.length) {
            
            // Todos los productos tienen suficiente stock
            await Promise.all(productsToUpdate.map(product => product.save()));

            // Crear y guardar el ticket
            const ticketData = {
                code: generateUniqueCode(),
                purchase_datetime: new Date(),
                amount: calculateTotalAmount(cart.products),
                purchaser: req.user.email // o el usuario asociado al carrito
            };
            const newTicket = await ticketManager.createTicket(ticketData);

            // Actualizar el carrito con los productos no comprados
            cart.products = cart.products.filter(product => !productsNotPurchased.includes(product.productId));
            await cart.save();

            res.status(200).json({ message: 'Compra realizada con éxito', ticket: newTicket });
        } else {
            // Algunos productos no tienen suficiente stock
            res.status(400).json({ message: 'Algunos productos no tienen suficiente stock', productsNotPurchased });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al procesar la compra' });
    }
});



export default cartsRouter;