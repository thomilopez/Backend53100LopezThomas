import cartModel from '../persistencia/models/cartsDTO.js'
import productModel from '../persistencia/models/productsDTO.js'

export default class CartManagerNew {
    
    constructor() {
        console.log("Trabajando con cartManager")
    }
    getCartById = async (id) => {
        try {
            let result = await cartModel.findById(id)
            return result;
        } catch (error) {
            console.error("Error al buscar")
        }

    }
    createCart = async () => {
        let result = await cartModel.create({})
        return result
    }
    
    addProductToCart = async (cid, pid, quantity, user) => {
        try {
            let cart = await cartModel.findById(cid);
            let product = await productModel.findById(pid);

            if (user.rol === 'premium' && product.owner === user.email) {
                throw new Error('No puedes agregar tu propio producto al carrito');
            }

            let cartProduct = cart.products.find((product) => product.product.toString() === pid);
            if (cartProduct) {
                cartProduct.quantity += quantity;
            } else {
                cart.products.push({ product: pid, quantity });
            }
            return await cart.save();
        } catch (error) {
            console.error("Error al agregar producto al carrito:", error);
            return null;
        }
    }

    deleteProduct = async (cid, pid) => {
        try {
            let cart = await cartModel.findById(cid);
            let productIndex = cart.products.findIndex((product) => product.product.toString() === pid);
            if (productIndex !== -1) {
                cart.products.splice(productIndex, 1);
            } else {
                console.log("Producto no encontrado en el carrito");
            }
            return await cart.save();
        } catch (error) {
            console.error("Error al eliminar producto del carrito:", error);
            return null;
        }
    }
}

