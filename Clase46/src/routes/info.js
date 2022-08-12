const koa =require('koa');
const { Server } = require('http');
const Router= require('koa-router')
const router = new Router({
    prefix: '/info',
});
const os = require('os')
const compression=require('compression')

router.get('/', async(ctx, next)=>{
    const info={
        args: process.argv.slice(2),
        nombrePlataforma: process.platform ,
        verNode: process.version,
        mem: process.memoryUsage().rss,
        pathEjecucion: process.execPath,
        pid: process.pid,
        procesadores: os.cpus().length,
        carpetaProy: process.cwd()
    };
    ctx.body={
        message: info
    };
    ctx.status=200;
    await ctx.render('info.pug', {info: info})
});

module.exports = router.routes();