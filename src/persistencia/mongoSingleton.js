import mongoose from "mongoose";
import { entorno } from "../config/config.js"

const url = entorno.mongoURL

export default class MongoSingleton{
    static #instance;
    constructor(){
        mongoose.connect(url);
    }
    static getInstance(){
        if(this.#instance){
            console.log('Ya estás conectado');
            return this.#instance
        }
        this.#instance = new MongoSingleton()
        console.log('Conectado a la base de datos');
        return this.#instance;
    
    }
}

