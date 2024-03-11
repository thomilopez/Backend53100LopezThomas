import fs from 'fs/promises';

class CartManager {
    constructor(path) {
        this.path = path;
    }

    async createCart(newCart) {
        try {
            const carts = await this.getCarts();
            const lastId = carts.length > 0 ? carts[carts.length - 1].id : 0;
            const newCartWithId = { id: lastId + 1, ...newCart };
            carts.push(newCartWithId);
            await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
            console.log('Carrito creado exitosamente.');
        } catch (error) {
            console.error('Error al crear el carrito:', error);
            throw error;
        }
    }

    async getCartById(cartId) {
        try {
            const carts = await this.getCarts();
            return carts.find((cart) => cart.id === cartId);
        } catch (error) {
            console.error('Error al obtener el carrito por ID:', error);
            throw error;
        }
    }

    async addProductToCart(cartId, productId, quantity) {
        try {
            const carts = await this.getCarts();
            const cartIndex = carts.findIndex((cart) => cart.id === cartId);
            if (cartIndex !== -1) {
                const cart = carts[cartIndex];
                const product = { productId, quantity };
                if (!cart.products) {
                    cart.products = [];
                }
                const existingProductIndex = cart.products.findIndex((p) => p.productId === productId);
                if (existingProductIndex !== -1) {
                    cart.products[existingProductIndex].quantity += quantity;
                } else {
                    cart.products.push(product);
                }
                carts[cartIndex] = cart;
                await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
                console.log('Producto agregado al carrito exitosamente.');
            } else {
                console.log('No se encontró ningún carrito con el ID especificado.');
            }
        } catch (error) {
            console.error('Error al agregar el producto al carrito:', error);
            throw error;
        }
    }

    async getCarts() {
        try {
            const data = await fs.readFile(this.path);
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                return [];
            } else {
                throw error;
            }
        }
    }
}

export default CartManager;