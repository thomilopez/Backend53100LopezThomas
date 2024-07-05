import ProductManagerNew from '../productManagerNew.js';

const productManager = new ProductManagerNew();

export const getProductsPaginated = async (req, res) => {
    const { page = 1, limit = 10, sort, query } = req.query;
    try {
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined,
            populate: 'products'
        };
        const result = await productManager.productModel.paginate({}, options);
        res.json({
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.hasPrevPage ? result.prevPage : null,
            nextPage: result.hasNextPage ? result.nextPage : null,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}&limit=${limit}&sort=${sort}&query=${query}` : null,
            nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}&limit=${limit}&sort=${sort}&query=${query}` : null
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos paginados.' });
    }
};

export const getProductById = async (req, res) => {
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
};

export const addProduct = async (req, res) => {
    try {
        const newProduct = req.body;
        await productManager.addProduct(newProduct);
        res.json({ message: 'Producto agregado exitosamente.', newProduct });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const productId = req.params.pid;
        const updatedFields = req.body;
        await productManager.updateProduct(productId, updatedFields);
        res.json({ message: 'Producto actualizado exitosamente.', updatedFields });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        await ProductManagerNew.deleteProduct(productId);
        res.json({ message: 'Producto eliminado exitosamente.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
