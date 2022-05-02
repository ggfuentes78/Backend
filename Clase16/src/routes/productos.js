const express =require('express');
const router = express.Router();
const Contenedor = require('../utils/contenedor');


const validaItem= (item)=>{
    let itemOK
    if (item.nombre==''||item.precio==''){
        itemOK=false
    }else{
        itemOK=true
    }
    return itemOK
}

let productos



const mwProductos = async (req,resp, next)=>{
    try{
        console.log('holaaa')
        const prodDB= await Contenedor.init();
        console.log ('prodb',prodDB)
        let prods = await Contenedor.getAll();
        productos= new Contenedor(prods);
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

router.post('/',mwProductos, (request, response)=>{
    // const idAsignado= productos.generaId();
    const body= request.body;
    console.log('body',body)
    const query =response.query;
    console.log('query', query)
    const item= {
        nombre: body.nombre,
        precio: parseFloat(body.precio),
        thumbnail: body.thumbnail,
        // id: idAsignado
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


router.get('/:id', mwProductos, async (request, response)=>{
    const id = (request.params.id);
    console.log('id', id)
    let producto= await productos.getById(id);
    if (producto.length){
        console.log('pp',producto);
        response.json(producto)
    }else{
        response.status(404).json({
            error : 'producto no encontrado' 
        })
    }
})

router.delete('/:id', mwProductos, async(request, response)=>{
    const id = request.params.id;
    const prods=await productos.deleteById(id);
    console.log('prods2', prods)
    if (prods!=null){
        response.json(prods)
    }else{
        response.status(404).json({error : 'producto no encontrado'})
    }
});

router.put('/:id', mwProductos, async (request, response)=>{
    const id = request.params.id;
    const itemNewData= request.query;
    console.log('newData', itemNewData)
    let producto= await productos.getById(id);
    if (producto.length){
        console.log(producto);
        productos.updateItem(id, itemNewData);
        producto= await productos.getById(id);
        console.log(producto);
        response.json(producto);
    }else{
        response.status(404).json({error : 'producto no encontrado'});
    }
});

module.exports = router;