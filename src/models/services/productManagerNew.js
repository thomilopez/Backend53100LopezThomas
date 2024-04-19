import productModel from '../products.js';


export default class ProductManagerNew {
    
    constructor() {
        console.log("Trabajando con ProductManager")
    }
    
    getAll = async (limit) => {
        let result = await productModel.find().limit(limit)
        return result
    }
    getById = async (id) => {
        try {
            const product = await productModel.findById(id);
            return product;
        } catch (error) {
            console.error("Error al buscar el producto por ID:", error);
        }
    }
    getByBrand = async (brand) => {
        let result = await productModel.find({brand: brand})
        return result
    }
    addProduct = async (product) => {
        let result = await productModel.create(product)
        return result
    }
    updateProduct = async (id, productData) => {
        let result = await productModel.updateOne({_id:id},{$set: productData})
        return result
    }
    deleteProduct = async (id) => {
        let result = await productModel.deleteOne({_id:id})
        return result
    }
}