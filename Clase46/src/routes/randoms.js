const koa =require('koa');
const Router = require('koa-router');
const router=new Router({
    prefix: '/randoms'
});
const {fork}=require('child_process');
const path=require('path');
// const compression=require('compression')

const randomScriptFile = path.resolve(__dirname, '../utils/randoms.js');
let cant

router.get('/', (ctx,next)=>{
    cant = ctx.request.query.cant
    if(!cant){
        cant=10000
    }
    const computo = fork(randomScriptFile);
    computo.send({msg: 'start', cant: cant})
    computo.on('message', (numeros)=>{
        ctx.body=({puerto: process.argv.slice(2),
            numeros: numeros})
    })
})

module.exports = router.routes();
