import userModel from "../persistencia/models/usersDTO.js";
import { isValidPassword, generateToken, sendEmail, createHash } from "../utils.js";
import jwt  from 'jsonwebtoken';
import { entorno } from "../config/config.js";


export default class AuthManager {
    constructor() {
        console.log("Constructor AuthManager");
    }

    async login({ email, password }) {
    try {
        const user = await userModel.findOne({ email });
        if (!user) return "Usuario no encontrado";
        const valid = isValidPassword(user, password);
        if (!valid) return "Error de auteuticación";
        const token = generateToken(email);
        return { message: "Autenticacion exitosa", token };
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: "error", massage: error.message });
    }}

    async sendResetEmail(email) {
        try {
            const user = await userModel.findOne({ email });
            if (!user) return "Usuario no encontrado";

            const token = generateToken(email);
            const resetLink = `http://localhost:8080/reset-password?token=${token}`;

            await sendEmail(user.email, 'Restablecimiento de contraseña', `Haga clic en <a href="${resetLink}">este enlace</a> para restablecer su contraseña.`);

            return "Correo de restablecimiento enviado";
        } catch (error) {
            console.log(error);
            return { status: "error", message: error.message };
        }
    }

    async resetPassword(token, newPassword) {
        try {
            const decoded = jwt.verify(token, entorno.secretJWT);
            const user = await userModel.findOne({ email: decoded.email });

            if (!user) return "Usuario no encontrado";
            const isSamePassword = isValidPassword(user, newPassword);
            if (isSamePassword) return "No se puede usar la misma contraseña";

            user.password = createHash(newPassword);
            await user.save();

            return "Contraseña restablecida exitosamente";
        } catch (error) {
            console.log(error);
            return { status: "error", message: error.message };
        }
    }
    async validateResetToken(token) {
        try {
            const decoded = jwt.verify(token, entorno.secretJWT);
            const user = await userModel.findOne({ email: decoded.email });

            if (!user) {
                return false; // Usuario no encontrado
            }

            // Verificar si el token está expirado
            const currentTimestamp = new Date().getTime() / 1000; // Tiempo actual en segundos
            if (decoded.exp < currentTimestamp) {
                return false; // Token expirado
            }

            return true; // Token válido
        } catch (error) {
            console.error('Error al validar el token de restablecimiento:', error);
            return false;
        }
    }
}