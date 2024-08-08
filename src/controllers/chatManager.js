import chatModel from '../persistencia/models/messagessDTO.js'
import logger from '../middlewares/logger.js'

export default class ChatManager {
	constructor() {
		logger.info('Trabajando con ChatManager')
	}

	async saveMessage(user, message) {
		try {
			const newMessage = new chatModel({ user, message })
			await newMessage.save()
			logger.info('Mensaje guardado:', newMessage)
			return newMessage
		} catch (error) {
			logger.error('Error al guardar el mensaje:', error)
			throw new Error('No se pudo guardar el mensaje')
		}
	}

	async getAllMessages() {
		try {
			const messages = await chatModel.find()
			return messages
		} catch (error) {
			logger.error('Error al obtener los mensajes:', error)
			throw new Error('No se pudieron obtener los mensajes')
		}
	}
}
