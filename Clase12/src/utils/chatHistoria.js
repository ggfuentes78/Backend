const express =require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs/promises');
const { response } = require('express');


const file='../../public/chatHistoria.txt';

const ruta= path.resolve(__dirname, file);

class ChatHistoria{
    mensajes;

    constructor (listaMensajes){
        this.mensajes = listaMensajes;
    }

    async save(item){ //Recibe un objeto y lo guarda en el archivo
        console.log('save item', item);
        console.log(this.mensajes)
        this.mensajes.push(item)
        const mensajesStringified = JSON.stringify(this.mensajes, null, '\t');
        await fs.writeFile(ruta, mensajesStringified)
    };

    static getChats(){ //Devuelve un array con los objetos presentes en el archivo 
        return fs.readFile(ruta, 'utf-8')
    };
};

module.exports = router;

module.exports= ChatHistoria;