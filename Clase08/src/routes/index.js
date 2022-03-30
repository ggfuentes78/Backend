const express =require('express');

const router = express.Router();
const routerProductos = require('./productos');

router.get('/',(request, response)=>{
    response.json({
        
    })
})

router.use('/productos', routerProductos);

module.exports =router;
