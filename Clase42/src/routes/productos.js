const express =require('express');
const router = express.Router();
const {Contenedor,validaItem, save, updateItem, generaId, getById, getAll, deleteById, getProducts} = require('../controllers/productos');
const session= require('express-session');
const {logger} = require('../services/logger');
const {validarLogin}=require('../controllers/auth');

// const validarLogin=(req, res, next)=>{
    // next()
// };


const init = async () =>{
listaProductos=await Contenedor
}

init()

router.get('/', validarLogin, getProducts, (request, response)=>{
    const user= request.user.email
    const productos={
        // user: request.user.email,
        productos: listaProductos.productos
    }    
    response.json(productos)
    // response.render('productos', productos, user)
});

router.post('/', validarLogin, (request, response)=>{
    const body= request.body;
    const item= {
        nombre: body.nombre,
        precio: parseFloat(body.precio),
        thumbnail: body.thumbnail,
    }
    const cargaOK= validaItem(item)
    if (cargaOK){
        save(item)
        response.status(200).json({msg: 'Producto agregado ok'})
    }else{
        response.status(400).json({error : 'Debe completar datos'})
    }
});


router.get('/:id', validarLogin, async (request, response)=>{
    const id = (request.params.id);
    let producto= await getById(id);
    if (producto.length!=0){
        response.json(producto)
    }else{
        response.status(404).json({
            error : 'producto no encontrado' 
        })
    }
})

router.delete('/:id', validarLogin, async(request, response)=>{
    const id = request.params.id;
    const prods=await deleteById(id);
    if (prods!=null){
        response.json(prods)
    }else{
        response.status(404).json({error : 'producto no encontrado'})
    }
});

router.put('/:id', validarLogin, async (request, response)=>{
    const id = request.params.id;
    const itemNewData= request.query;
    let producto= await getById(id);
    if (producto.length!=0){
        await updateItem(id, itemNewData);
        producto=await getById(id);
        response.json(producto);
    }else{
        response.status(404).json({error : 'producto no encontrado'});
    }
});

module.exports = router;

