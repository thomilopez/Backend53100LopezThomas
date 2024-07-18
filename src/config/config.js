import dotenv from "dotenv";

dotenv.config();

export const entorno= {
    port: process.env.PORT,
    mongoURL: process.env.DB_URL,
    secretJWT: process.env.JWT_SECRET,
    MAIL_USER: process.env.MAIL_USER,
    MAIL_PASS: process.env.MAIL_PASS
}