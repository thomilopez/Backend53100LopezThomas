import cartsModel from '../../models/carts.js'

class CartsDAO {
	async getAllCarts() {
		return await cartsModel.find()
	}

	async getCartById(cartId) {
		return await cartsModel.findById(cartId)
	}

	async createCart(newCart) {
		return await cartsModel.create(newCart)
	}

	async updateCart(cartId, updatedCart) {
		return await cartsModel.findByIdAndUpdate(cartId, updatedCart, {
			new: true,
		})
	}

	async deleteCart(cartId) {
		return await cartsModel.findByIdAndDelete(cartId)
	}
}

export default new CartsDAO()
