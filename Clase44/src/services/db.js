const mongoose = require('mongoose');
const config = require ('../config/index');
const { logger } = require('./logger');

const connectionString = config.MONGO_ATLAS_SRV2 || 'mongodb://localhost:27017/gfuentes';


const initMongoDB = async ()=>{
    try{
        logger.info('Conectando a BD...');
        if(mongoose.connection.readyState==0){
        await mongoose.connect(connectionString);
        logger.info('Conexion a BD exitosa!')
        }else{
            logger.info('Ya existe Conexion a BD')
        }
    }catch(error){
        logger.error(`Error al conectar a BD - ${error}`);
        return error
    }
}

module.exports=initMongoDB()