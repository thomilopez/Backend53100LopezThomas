import express  from "express";
import { getAllMessages, saveMessage } from "../controllers/controllersRouter/chatController.js";	
import AuthorizationMiddleware from '../middlewares/authorizationMiddleware.js';

const chatRouter = express.Router();

// Ruta para obtener todos los mensajes
chatRouter.get('/messages', AuthorizationMiddleware.isUser, getAllMessages);

// Ruta para enviar un mensaje
chatRouter.post('/messages', AuthorizationMiddleware.isUser, saveMessage);
export default chatRouter;
