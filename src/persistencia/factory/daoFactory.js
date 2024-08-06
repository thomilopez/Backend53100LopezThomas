import CartsDAO from '../DAO/cartsDAO.js'
import MessagesDAO from '../DAO/messagesDAO.js'
import ProductsDAO from '../DAO/productsDAO.js'
import UsersDAO from '../DAO/usersDAO.js'

class DAOFactory {
	getDAO(daoType) {
		switch (daoType) {
			case 'carts':
				return new CartsDAO()
			case 'messages':
				return new MessagesDAO()
			case 'products':
				return new ProductsDAO()
			case 'users':
				return new UsersDAO()
			default:
				throw new Error(`El tipo de DAO ${daoType} no está soportado.`)
		}
	}
}

export default new DAOFactory()
