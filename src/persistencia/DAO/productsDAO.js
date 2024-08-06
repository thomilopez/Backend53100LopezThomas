import productModel from '../models/productsDTO.js'

class ProductsDAO {
	async getAllProducts() {
		return await productModel.find()
	}

	async getProductById(productId) {
		return await productModel.findById(productId)
	}

	async createProduct(newProduct) {
		return await productModel.create(newProduct)
	}

	async updateProduct(productId, updatedProduct) {
		return await productModel.findByIdAndUpdate(productId, updatedProduct, {
			new: true,
		})
	}

	async deleteProduct(productId) {
		return await productModel.findByIdAndDelete(productId)
	}
}

export default ProductsDAO
