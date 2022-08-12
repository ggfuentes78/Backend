// const yargs = require('yargs');
const { initMongoDB } = require ('./db');
const args = require('./args')
const createError  = require('http-errors');
const config= require('../config/index')
const Koa = require('koa');
const path = require('path');
const mainRouter = require('../routes/index');
const viewsPath= path.resolve(__dirname, '../../views');
const http =require('http');
const { initWsServer} = require ('./socket');
const session = require ('koa-session');
const MongoStore= require('connect-mongo');
const { password } = require('../models/users/users');
const passport = require('koa-passport');
const loginFunc = require('../controllers/auth').loginFunc
const signupFunc = require('../controllers/auth').signupFunc
const cluster=require('cluster');
const os=require('os');
const {graphqlHTTP}= require('graphql');
const {graphqlSchema, graphqlRoot}=require('./graphql');
const koaBody = require('koa-body');
const serve = require('koa-static');

const views= require('koa-views');
const render=views(viewsPath, {extension: 'pug'} )


const inicioBD = initMongoDB
const aplicacion = new Koa();

const compression = require('compression');
const { loggeoPeticiones } = require('./logger');
const { appendFile } = require('fs');



//Configuracion de Yargs
// const args = yargs
    // .alias({
        // p:'puerto',
        // m:'modo',
        // d: 'dao',
    // })
    // .describe({
        // p: 'Indica el puerto de escucha del Servidor (8080 por defecto)',
        // m: 'Indica el modo fork o cluster. (fork por defecto)',
        // d: 'Indica el DAO para la base de productos'
    // })
    // .choices({
        // m: ['cluster', 'fork'],
        // d: ['fs', 'psql', 'mem']
    // })
    // .default({
        // puerto:8080,
        // modo:'fork',
        // dao: 'mysql',
    // })
    // .argv;

aplicacion.use(render)

const puerto = config.PORT || args['puerto']
const modo=args['modo']
const persistencia=args['dao']

aplicacion.keys=[config.SESSION_SECRET] || ['claveSuperSecreta']
//Configuracion de Express-Session
aplicacion.use(
    session({
        key: 'koa.sess',
        httpOnly: false,
        secure: false,
        maxAge: 60000,
        rolling: true,
        renew: true,
    }, aplicacion)
);

//Se indica que passport va a utilizarse en todas las rutas y se le delega el manejo de sesiones
aplicacion.use(passport.initialize());
aplicacion.use(passport.session());


// passport.use('login', loginFunc);
// passport.use('signup', signupFunc);

//Se utiliza compression para minimizar la trafico de datos
// aplicacion.use(compression());

// aplicacion.set('views', viewsPath);
// aplicacion.set('view engine', 'pug');

// const numCPUs = os.cpus().length;

// logger.info(`Inicio de Server en modo: ${modo} - ${persistencia}`);

// if(modo=='cluster'){
    // if (cluster.isMaster){
        //MASTER
        // logger.info(`PID Master - ${process.pid}`);
        // for (let i = 0; i< numCPUs; i++){ //Se crean tantos workers como procesadores existen
            // cluster.fork();
        // }
// 
        // cluster.on('exit', (worker, code)=>{
            // logger.info(`Worker ${worker.process.pid} finalizo con codigo ${code} a las ${Date()}`);
            // cluster.fork();
        // })
    // }else{
        //WORKERS
        // const servidor = server.listen(puerto,()=>{
            // logger.info(`Server Listo. Escuchando en el puerto ${puerto} - PID WORKER ${process.pid}`)
        // });
// 
        // servidor.on('error', (err)=>{
            // logger.error('Hubo un error', err)
        // });
    // }
// }else{
    // const servidor = server.listen(puerto,()=>{
        // logger.info(`Server Listo. Escuchando en el puerto ${puerto} - PID ${process.pid}`)
    // });
    // servidor.on('error', (err)=>{
        // logger.error('Hubo un error', err)
    // });
// }


// aplicacion.use (koa.json());
// aplicacion.use(koa.urlencoded({extended: true}));
aplicacion.use(koaBody());

// const publicPath = path.resolve('../../public');
// aplicacion.use(serve(publicPath));

aplicacion.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      const miError = err;
      console.log(`HUBO UN ERROR ${miError.message}`);
      ctx.status = 500;
      ctx.body = { error: miError.message };
      ctx.app.emit('error', err, ctx);
    }
  });

// aplicacion.use(loggeoPeticiones);


aplicacion.use(mainRouter);


// aplicacion.use('/graphql', graphqlHTTP({schema: graphqlSchema, rootValue: graphqlRoot, graphiql:true}));

// aplicacion.use(mainRouter);

const server = http.Server(aplicacion);

//Init SocketIo Server
initWsServer(server);

module.exports=aplicacion
// aplicacion.use(function(req, res, next) {
    // res.status(404).send('Ruta no definida')
//   });

// aplicacion.use(function(err, req, res, next) {
    // res.status(err.status || 500).send(err);
//   });