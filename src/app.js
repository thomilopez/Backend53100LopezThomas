const express = require('express');
const app = express();
const productsRouter = require('./routes/productsRouter');
const cartsRouter = require('./routes/cartsRouter');

const ProductManager = require('./ProductManager');
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
    app.listen(8080, () => {
    console.log('Servidor en ejecución en el puerto 8080');
    });
    // viejo 

    //nuevo 
    app.use(express.json());

    app.use('/api/products', productsRouter);
    app.use('/api/carts', cartsRouter);

    const PORT = 8080;
    app.listen(PORT, () => {
        console.log(`Servidor en ejecución en el puerto ${PORT}`);
    });
