import chatModel from "../persistencia/messagess.js";

export default class ChatManager {
    constructor() {
        console.log("Trabajando con ChatManager")
    }

    async saveMessage(user, message) {
        try {
            const newMessage = new chatModel({ user, message });
            await newMessage.save();
            console.log('Mensaje guardado:', newMessage);
            return newMessage;
        } catch (error) {
            console.error('Error al guardar el mensaje:', error);
            throw new Error('No se pudo guardar el mensaje');
        }
    }

    async getAllMessages() {
        try {
            const messages = await chatModel.find();
            return messages;
        } catch (error) {
            console.error('Error al obtener los mensajes:', error);
            throw new Error('No se pudieron obtener los mensajes');
        }
    }
}