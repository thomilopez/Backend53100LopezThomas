import mongoose from 'mongoose'
import { entorno } from '../config/config.js'
import logger from '../middlewares/logger.js'

const url = entorno.mongoURL

export default new (class MongoSingleton {
	#instance
	constructor() {
		mongoose.connect(url)
	}
	getInstance() {
		if (this.#instance) {
			logger.info('Ya estás conectado')
			return this.#instance
		}
		this.#instance = new MongoSingleton()
		logger.info('Conectado a la base de datos')
		return this.#instance
	}
})()
