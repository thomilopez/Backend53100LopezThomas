import ChatManager from '../chatManager.js'
import io from '../../app.js'
import logger from '../../middlewares/logger.js'

const chatManager = new ChatManager()

export const getAllMessages = async (req, res) => {
	try {
		const messages = await chatManager.getAllMessages()
		res.json(messages)
	} catch (error) {
		logger.error(`Error en obtener los mensajes: ${error.message}`)
		res.status(500).json({ error: 'Error al obtener los mensajes del chat.' })
	}
}

export const saveMessage = async (req, res) => {
	try {
		const { user, message } = req.body
		const newMessage = await chatManager.saveMessage(user, message)
		io.emit('newMessage', newMessage)
		res.json({ message: 'Mensaje guardado exitosamente.' })
	} catch (error) {
		logger.error(`Error en guardar el mensaje: ${error.message}`)
		res.status(400).json({ error: 'Error al guardar el mensaje.' })
	}
}
