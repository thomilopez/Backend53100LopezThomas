import dotenv from "dotenv";

dotenv.config();

export const entorno= {
    port: process.env.PORT,
    mongoURL: process.env.DB_URL,
    secretJWT: process.env.JWT_SECRET,
    
}