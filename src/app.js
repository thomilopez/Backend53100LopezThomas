const express = require('express');
const ProductManager = require('./ProductManager');

const app = express();
const productManager = new ProductManager('/product.json');

    app.get('/products', async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const products = await productManager.getProducts();
        
        if (limit) {
        res.json(products.slice(0, limit));
        } else {
        res.json(products);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos.' });
    }
    });

    app.get('/products/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const products = await productManager.getProducts();
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

    app.listen(3000, () => {
    console.log('Servidor en ejecución en el puerto 3000');
    });