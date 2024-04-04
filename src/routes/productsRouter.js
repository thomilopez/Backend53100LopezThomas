import express from 'express';
// import ProductManager from '../models/ProductManager.js';
import ProductManagerNew from '../models/services/productManagerNew.js';
const productsRouter = express.Router();
const productManager = new ProductManagerNew();


productsRouter.get('/', async (req, res) => {
    try {
        const products = await productManager.getAll();
        res.render('home', { products });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos.' });
    }
});

productsRouter.get('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const products = await productManager.getAll();
        const product = products.find((p) => p.id === productId);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto.' });
    }
});

productsRouter.post('/', async (req, res) => {
    try {
        const newProduct = req.body;
        await productManager.addProduct(newProduct);
        res.json({ message: 'Producto agregado exitosamente.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

productsRouter.put('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const updatedFields = req.body;
        await productManager.updateProduct(productId, updatedFields);
        res.json({ message: 'Producto actualizado exitosamente.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

productsRouter.delete('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        await productManager.deleteProduct(productId);
        res.json({ message: 'Producto eliminado exitosamente.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default productsRouter;

