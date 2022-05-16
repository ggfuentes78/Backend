import express from 'express';
import mainRouter from '../routes/index';
import http from 'http';

const aplicacion = express();

aplicacion.use(express.json());
aplicacion.use(express.urlencoded({extended: true}));

aplicacion.use('/api', mainRouter);

// const publicPath = path.resolve(__dirname, '../../public');
// aplicacion.use(express.static(publicPath));

aplicacion.use(function (err, req, res, next) {
    return res.status('500').json({
        msg: 'Se ha producido un error inesperado',
        error: err.message,
    });
});

const httpServer = http.Server(aplicacion);

export default httpServer;

