const express = require('express');
const { appendFile } = require('fs');
const path = require('path');
const fs = require('fs/promises');
const mainRouter = require('./routes/index');
const viewsPath= path.resolve(__dirname, './views');


const aplicacion = express();
const puerto = 8080;

aplicacion.set('views', viewsPath);
aplicacion.set('view engine', 'pug');

const servidor = aplicacion.listen(puerto,()=>{
    console.log("Server Listo. Escuchando en el puerto", puerto)
});

servidor.on('error', (err)=>{
    console.log('Hubo un error', err)
});

aplicacion.use (express.json());
aplicacion.use(express.urlencoded({extended: true}));

const publicPath = path.resolve(__dirname, '../public');
aplicacion.use(express.static(publicPath));

aplicacion.use('/api', mainRouter);

aplicacion.use('/', mainRouter);
