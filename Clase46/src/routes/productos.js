const koa =require('koa');
const Router=require('koa-router')
const router = new Router({
    prefix: '/productos'
});
const {Contenedor,validaItem, save, updateItem, generaId, getById, getAll, deleteById, getProducts} = require('../controllers/productos');
const session= require('koa-session');
const {logger} = require('../services/logger');
const {validarLogin}=require('../controllers/auth');

// const validarLogin=(req, res, next)=>{
    // next()
// };


// const init = async () =>{
// listaProductos=await Contenedor
// }
// 
// init()

router.get('/', async(ctx, next)=>{
    // const user= ctx.request.user.email
    const listaProductos= await getAll()
    const productos={
        // user: request.user.email,
        productos: listaProductos.productos
    }    
    ctx.body=(productos);
    ctx.status=200
    // ctx.render('productos.pug', productos)
});

router.post('/', async (ctx, next)=>{
    const body= ctx.request.body;
    const item= {
        nombre: body.nombre,
        precio: parseFloat(body.precio),
        thumbnail: body.thumbnail,
    }
    const cargaOK= validaItem(item)
    if (cargaOK){
        await save(item)
        ctx.status=200
        ctx.body={msg: 'Producto agregado ok'}
    }else{
        ctx.status=400
        ctx.body={error : 'Debe completar datos'}
    }
});


router.get('/:id',  async (ctx, next)=>{
    const id = (ctx.params.id);
    let producto= await getById(id);
    if (producto.length!=0){
        ctx.status=200;
        ctx.body= producto;
    }else{
        ctx.status=(404);
        ctx.body={error : 'producto no encontrado'};
    }
})

router.delete('/:id', async(ctx, next)=>{
    const id = ctx.request.params.id;
    const prods=await deleteById(id);
    if (prods!=null){
        ctx.status=200
        ctx.body=prods
    }else{
        ctx.status=404
        ctx.body={error : 'producto no encontrado'}
    }
});

router.put('/:id', async (ctx, next)=>{
    const id = ctx.request.params.id;
    const itemNewData= ctx.request.query;
    let producto= await getById(id);
    if (producto.length!=0){
        await updateItem(id, itemNewData);
        producto=await getById(id);
        ctx.status=200;
        ctx.body=producto;
    }else{
        ctx.status=404;
        ctx.body={error : 'producto no encontrado'};
    }
});

module.exports = router.routes();

