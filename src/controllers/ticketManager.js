import ticketModel from "../persistencia/models/ticketModel.js";

export default class TicketModel {
    constructor() {
        console.log("Trabajando con TicketModel");
    }
    createTicket = async () => {
        let result = await ticketModel.create({})
        return result
    }
    


}