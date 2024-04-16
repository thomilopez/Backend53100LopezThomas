import cartModel from '../carts.js';


export default class CartManagerNew {
    
    constructor() {
        console.log("Trabajando con cartManager")
    }
    getCartById = async (id) => {
        let result = await cartModel.findById(id)
        return result
    }
    createCart = async () => {
        let result = await cartModel.create({})
        return result
    }
    
    addProductToCart = async (cid, pid, quantity) => {
        let cart = await cartModel.findById(cid)
        let product = cart.product.find((product) => product.product.toString() === pid )
        if (product){
            product.quantity += quantity;
        } else {
            cart.product.push({ product: pid, quantity})
        }
        return await cart.save();
    }

    deleteProduct = async (cid, pid) => {
        let cart = await cartModel.findById(cid)
        let index = cart.product.findIndex((product) => product.product.toString() === pid);
            if (index === -1) {
        console.log("Producto no encontrado");
            } else {
        cart.product.splice(index, 1);
            }
        return await cart.save();
    }
}

