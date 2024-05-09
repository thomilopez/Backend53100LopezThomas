import productModel from '../products.js';

export default class ProductManagerNew {
    constructor() {
        console.log("Trabajando con ProductManager");
    }

    getAll = async (limit) => {
        try {
            let result = await productModel.find().limit(limit);
            return result;
        } catch (error) {
            console.error("Error al obtener todos los productos:", error);
            throw new Error("No se pudieron obtener todos los productos");
        }
    }

    getById = async (id) => {
        try {
            const product = await productModel.findById(id);
            return product;
        } catch (error) {
            console.error("Error al buscar el producto por ID:", error);
            throw new Error("No se pudo encontrar el producto");
        }
    }

    getByBrand = async (brand) => {
        try {
            let result = await productModel.find({ brand: brand });
            return result;
        } catch (error) {
            console.error("Error al buscar productos por marca:", error);
            throw new Error("No se pudieron obtener los productos por marca");
        }
    }

    addProduct = async (product) => {
        try {
            let result = await productModel.create(product);
            return result;
        } catch (error) {
            console.error("Error al agregar un nuevo producto:", error);
            throw new Error("No se pudo agregar el producto");
        }
    }

    updateProduct = async (id, productData) => {
        try {
            let result = await productModel.updateOne({ _id: id }, { $set: productData });
            return result;
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
            throw new Error("No se pudo actualizar el producto");
        }
    }

    deleteProduct = async (id) => {
        try {
            let result = await productModel.deleteOne({ _id: id });
            return result;
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            throw new Error("No se pudo eliminar el producto");
        }
    }
}