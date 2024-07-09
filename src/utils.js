import {fileURLToPath} from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { entorno } from './config/config.js';
import mongoose from 'mongoose';
import {fakerDE as faker } from '@faker-js/faker';

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
export const generateUniqueCode = async () => {
    const newObjectId = new mongoose.Types.ObjectId();
    return newObjectId.toString().slice(19);
};

export const generateProduct = () => {  
    return {
        title: faker.commerce.productName(),
        price: faker.commerce.price(),
        id: faker.database.mongodbObjectId(),
        department: faker.commerce.department(),
        description: faker.commerce.productDescription(),
    };
};

export const generateMockingProducts = () => {
    let numOfProducts = 100;
    let products = [];
    for (let i = 0; i < numOfProducts; i++) {
        products.push(generateProduct());
    }
    return products;
};

export class CustomError {
    static createCustomError(name, message, code, description) {
        let error = new Error(message);
        error.name = name;
        error.code = code;
        error.description = description;
        return error;
    }
}

export const errorTypes = {
    ERROR_INVALID_ARGUMENTS: 400,
    ERROR_DATA: 400,
    ERROR_NOT_FOUND: 404,
    ERROR_UNAUTHORIZED: 401,
    ERROR_FORBIDDEN: 403,
    ERROR_INTERNAL_ERROR: 500,
};

export const errorDictionary = {
    ProductCreationError: "There was an error creating the product.",
    CartAdditionError: "There was an error adding the product to the cart.",
    ProductNotFoundError: "Product not found.",
    InvalidProductQuantityError: "Invalid product quantity.",
    CartNotFoundError: "Cart not found.",
};


export default __dirname;