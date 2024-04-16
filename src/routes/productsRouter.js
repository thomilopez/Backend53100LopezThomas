import express from 'express';
// import ProductManager from '../models/ProductManager.js';
import ProductManagerNew from '../models/services/productManagerNew.js';
const productsRouter = express.Router();



productsRouter.get('/', async (req, res) => {
    try {
        const products = await ProductManagerNew.getAll();
        console.log(products)
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos.' });
    }
});

productsRouter.get('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const products = await ProductManagerNew.getAll();
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
        await ProductManagerNew.addProduct(newProduct);
        res.json({ message: 'Producto agregado exitosamente.' }, newProduct);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

productsRouter.put('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const updatedFields = req.body;
        await ProductManagerNew.updateProduct(productId, updatedFields);
        res.json({ message: 'Producto actualizado exitosamente.' }, updatedFields);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

productsRouter.delete('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        await ProductManagerNew.deleteProduct(productId);
        res.json({ message: 'Producto eliminado exitosamente.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default productsRouter;

