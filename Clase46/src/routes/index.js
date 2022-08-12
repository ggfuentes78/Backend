const Router = require('koa-router');

const router = new Router({
    prefix: '/api',
});

//Routers
const routerProductos = require('./productos');
// const routerProductosTest = require('./productos-test');
const routerInfo = require('./info');
const routerRandoms = require('./randoms'); 
const routerAuth = require('./auth');

const path = require('path');

const file='../../public/productos.txt';

const {Contenedor, getProducts} = require('../controllers/productos');

const {logger, loggeoPeticiones} = require('../services/logger');
const { validarLogin } = require('../controllers/auth');


router.use(routerInfo);

// router.use(routerRandoms);
// 
router.use(routerProductos);
// 
// router.use(routerAuth);

// router.use(routerProductosTest);


// router.get('/', async(ctx, next)=>{
    // loggeoPeticiones
// })
// 
// router.get('/', async(ctx, next)=>{
    // validarLogin
// })
// 
// router.get('/', async(ctx, next)=>{
    // getProducts
// })
// 
// router.get('/', async(ctx, next)=>{
    // const productos={
        // user: ctx.request.user.email,
        // productos: listaProductos.productos
    // }
    // ctx.render('altaProducto', productos)
// })


// router.use(async(ctx, next)=> {
    // const msg404= 'Ruta no definida'
    // logger.warn(`${msg404} - Se intento acceder a la ruta ${req.url} con el metodo ${req.method}`)
    // ctx.throw(404, msg404)
    // ctx.body={
        // send: msg404
    // }
    // ctx.status(404)
    // ctx.status(404).send(msg404)
// 
//   });

// router.use(function(err, req, res, next){
    // logger.error((`Algo salio mal - ${err}`))
    // res.status(500).send(`Algo salio mal - ${err}`)
// })

module.exports = router.routes();

