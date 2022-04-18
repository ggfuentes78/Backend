const express =require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs/promises');
const { response } = require('express');
const Contenedor = require('../utils/contenedor');


const file='../../public/productos.txt';
const fileVacio='../../public/productos_vacio.txt';
const fileTest='../../public/productos_test.txt';

const ruta= path.resolve(__dirname, file);

//Para probar  listado sin productos descomentar linea de abajo y comentar la de arriba

// const ruta= path.resolve(__dirname, fileVacio);


// const randomIndex = (min,max) =>{
    // return Math.floor(Math.random() * (max - min) + min);
// };

const validaItem= (item)=>{
    let itemOK
    if (item.nombre==''||item.price==''){
        itemOK=false
    }else{
        itemOK=true
    }
    return itemOK
}

let productos

const mwProductos = async (req,resp, next)=>{
    try{
        let prods = await Contenedor.getAll(ruta);
        let prodsJson = JSON.parse(prods);
        productos= new Contenedor(prodsJson);
        next()
    }
    catch(err){
        console.log('Error al recuperar los productos', err)
        resp.json({msg: err})
    }
}

router.get('/', mwProductos, (request, response)=>{
        response.render('productos', productos)
});

router.get('/:id', mwProductos, (request, response)=>{
    const id = request.params.id;
    let producto
    if (id=='random'){
        producto=productos.getRandom();
    }else{
        producto=productos.getById(id);
    }
    if (producto!=null){
        console.log(producto);
        response.json(producto)
    }else{
        response.status(404).json({
            error : 'producto no encontrado' 
        })
    }
})

router.post('/',mwProductos, (request, response)=>{
    const idAsignado= productos.generaId();
    const body= request.body;
    console.log('body',body)
    const query =response.query;
    console.log('query', query)
    const item= {
        nombre: body.nombre,
        price: body.price,
        thumbnail: body.thumbnail,
        id: idAsignado
    }
    const cargaOK= validaItem(item);
    if (cargaOK){
        productos.save(item);
        response.status(200).json({msg: 'Porducto agregado ok'})
        // response.redirect('/')
    }else{
        response.status(400).json({error : 'Debe completar datos'})
    }
});

router.delete('/:id', mwProductos, async(request, response)=>{
    const id = request.params.id;
    const prods=await productos.deleteById(id);
    console.log('prods', prods)
    if (prods!=null){
        response.json(prods)
    }else{
        response.status(404).json({error : 'producto no encontrado'})
    }
});

router.put('/:id', mwProductos, (request, response)=>{
    const id = request.params.id;
    const itemNewData= request.query;
    let producto=productos.getById(id);
    if (producto != null){
        console.log(producto);
        Object.assign(producto, itemNewData);
        productos.updateItem(producto);
        console.log(producto);
        response.json(producto);
    }else{
        response.status(404).json({error : 'producto no encontrado'});
    }
});

module.exports = router;
