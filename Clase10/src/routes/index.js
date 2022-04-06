const express =require('express');

const router = express.Router();
const routerProductos = require('./productos');

router.get('/',(request, response)=>{
    response.render('altaProducto')
})

router.use('/productos', routerProductos);

module.exports =router;
