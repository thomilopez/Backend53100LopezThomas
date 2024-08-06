import ticketModel from '../persistencia/models/ticketModel.js'
import { generateUniqueCode } from '../utils.js'

export default class TicketManager {
	constructor() {
		console.log('Trabajando con TicketManager')
	}

	createTicket = async (purchaseData) => {
		const { amount, purchaser } = purchaseData
		const code = await generateUniqueCode()
		const newTicket = await ticketModel.create({
			code,
			amount,
			purchaser,
		})
		return newTicket
	}
}
