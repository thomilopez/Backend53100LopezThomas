import ChatManager from "../chatManager.js";
import io from "../../app.js"

const chatManager = new ChatManager();

export const getAllMessages = async (req, res) => {
    try {
        const messages = await chatManager.getAllMessages();
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los mensajes del chat.' });
    }
};

export const saveMessage = async (req, res) => {
    try {
        const { user, message } = req.body;
        const newMessage = await chatManager.saveMessage(user, message);
        io.emit('newMessage', newMessage);
        res.json({ message: 'Mensaje guardado exitosamente.' });
    } catch (error) {
        res.status(400).json({ error: 'Error al guardar el mensaje.' });
    }
};