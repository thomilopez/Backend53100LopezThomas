import CartManagerNew from "../cartManagerNew.js"
import io from "../../app.js"
import TicketManager from "../ticketManager.js";
import ProductsDAO from "../../persistencia/DAO/productsDAO.js"
import { CustomError, errorTypes } from "../../utils.js";


const ticketManager = new TicketManager();
const cartManager = new CartManagerNew();
const productsDAO = new ProductsDAO();


export const deleteProductFromCart = async (req, res, next) => {
    try {
        const { cid, pid } = req.params;
        await cartManager.deleteProduct(cid, pid);
        res.json({ message: 'Producto eliminado del carrito exitosamente.' });
    } catch (error) {
        next(CustomError.createCustomError('CartNotFoundError', error.message, errorTypes.ERROR_NOT_FOUND));
    }
};

export const updateCart = async (req, res, next) => {
    try {
        const { cid } = req.params;
        const products = req.body.products;
        await cartManager.updateCart(cid, products);
        res.json({ message: 'Carrito actualizado exitosamente.' });
    } catch (error) {
        next(CustomError.createCustomError('CartUpdateError', error.message, errorTypes.ERROR_DATA));
    }
};

export const updateProductQuantity = async (req, res, next) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        if (quantity <= 0) {
            throw CustomError.createCustomError('InvalidProductQuantityError', 'Quantity must be greater than zero', errorTypes.ERROR_INVALID_ARGUMENTS);
        }
        await cartManager.updateProductQuantity(cid, pid, quantity);
        res.json({ message: 'Cantidad de producto actualizada exitosamente.' });
    } catch (error) {
        next(error);
    }
};


export const deleteAllProducts = async (req, res, next) => {
    try {
        const { cid } = req.params;
        await cartManager.deleteAllProducts(cid);
        res.json({ message: 'Todos los productos del carrito han sido eliminados.' });
    } catch (error) {
        next(CustomError.createCustomError('CartNotFoundError', error.message, errorTypes.ERROR_NOT_FOUND));
    }
};

export const createCart = async (req, res, next) => {
    try {
        const newCart = await cartManager.createCart();
        io.emit('cartCreated', newCart);
        res.json(newCart);
    } catch (error) {
        next(CustomError.createCustomError('CartCreationError', error.message, errorTypes.ERROR_INTERNAL_ERROR));
    }
};

export const getCartById = async (req, res, next) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartManager.getCartById(cartId);
        if (!cart) {
            throw CustomError.createCustomError('CartNotFoundError', 'Cart not found', errorTypes.ERROR_NOT_FOUND);
        }
        res.json(cart);
    } catch (error) {
        next(error);
    }
};

export const addProductToCart = async (req, res, next) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;
        await cartManager.addProductToCart(cartId, productId, quantity);
        res.json({ message: 'Producto agregado al carrito exitosamente.' });
    } catch (error) {
        next(CustomError.createCustomError('CartAdditionError', error.message, errorTypes.ERROR_DATA));
    }
};

export const purchaseCart = async (req, res, next) => {
    try {
        const cartId = req.params.cid;
        const { userId } = req.user;
        const cart = await cartManager.getCartById(cartId);
        if (!cart) {
            throw CustomError.createCustomError('CartNotFoundError', 'Cart not found', errorTypes.ERROR_NOT_FOUND);
        }

        const productsToProcess = [];

        // Verificar el stock de los productos en el carrito
        for (const product of cart.products) {
            const productInStock = await productsDAO.getProductById(product.productId);
            if (productInStock.stock >= product.quantity) {
                // Restar la cantidad del producto del stock
                await productsDAO.updateProduct(product.productId, {
                    stock: productInStock.stock - product.quantity
                });
            } else {
                // Agregar el producto a la lista de productos que no se pudieron procesar
                productsToProcess.push(product.productId);
            }
        }

        // Crear el ticket de compra
        const totalAmount = cart.products.reduce((total, product) => total + (product.quantity * product.price), 0);
        const newTicket = await ticketManager.createTicket({
            amount: totalAmount,
            purchaser: userId
        });

        // Actualizar el carrito con los productos que no se pudieron procesar
        const updatedCart = await cartManager.updateCart(cartId, {
            products: cart.products.filter(product => !productsToProcess.includes(product.productId))
        });

        res.status(200).json({
            ticket: newTicket,
            unprocessedProducts: productsToProcess,
            cart: updatedCart
        });
    } catch (error) {
        next(CustomError.createCustomError('PurchaseError', error.message, errorTypes.ERROR_INTERNAL_ERROR));
    }
};