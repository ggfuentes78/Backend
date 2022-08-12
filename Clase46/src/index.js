const args = require('./services/args')
const config= require('./config/index')
const os=require('os');
const { logger } = require('./services/logger');
const server=require('./services/server')


const puerto = config.PORT || args['puerto']
const modo=args['modo']
const persistencia=args['dao']


const numCPUs = os.cpus().length;

logger.info(`Inicio de Server en modo: ${modo} - ${persistencia}`);

if(modo=='cluster'){
    if (cluster.isMaster){
        //MASTER
        logger.info(`PID Master - ${process.pid}`);
        for (let i = 0; i< numCPUs; i++){ //Se crean tantos workers como procesadores existen
            cluster.fork();
        }

        cluster.on('exit', (worker, code)=>{
            logger.info(`Worker ${worker.process.pid} finalizo con codigo ${code} a las ${Date()}`);
            cluster.fork();
        })
    }else{
        //WORKERS
        const servidor = server.listen(puerto,()=>{
            logger.info(`Server Listo. Escuchando en el puerto ${puerto} - PID WORKER ${process.pid}`)
        });

        servidor.on('error', (err)=>{
            logger.error('Hubo un error', err)
        });
    }
}else{
    const servidor = server.listen(puerto,()=>{
        logger.info(`Server Listo. Escuchando en el puerto ${puerto} - PID ${process.pid}`)
    });
    servidor.on('error', (err)=>{
        logger.error('Hubo un error', err)
    });
}
