import {fileURLToPath} from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { entorno } from './config/config.js';


const JWT_SECRET = entorno.secretJWT

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createHash=(password)=>bcrypt.hashSync(password, bcrypt.genSaltSync(10))

export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password);
};
export const generateToken = (email) => {
    return jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });

};
export default __dirname;