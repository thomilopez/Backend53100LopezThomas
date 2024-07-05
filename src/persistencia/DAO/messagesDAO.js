import chatModel from "../../models/messagess.js"

class MessagesDAO {
    async getAllMessages() {
        return await chatModel.find();
    }

    async createMessage(newMessage) {
        return await chatModel.create(newMessage);
    }

    async deleteMessage(messageId) {
        return await chatModel.findByIdAndDelete(messageId);
    }
}

export default new MessagesDAO();