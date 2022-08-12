const server = require('../services/server')
// const aplicacion=require('../index');/// importar servidor???
const connection = require('../services/dbProductos');
const http=require('http')
const supertest= require('supertest');
const req= require('supertest').agent
// const mocha= require('mocha');
const expect=require('chai').expect;
const DaoProductos= require('../models/productos/dao/productos.postgreSql') ;
const ProductosFactoryDAO = require('../models/productos/factory/productos');
const { before, afterEach, it, beforeEach, after } = require('mocha');
const tableName = 'productos';
const config = require('../config/index');

const { logger } = require('../services/logger');
const { default: mongoose } = require('mongoose');
const { default: knex, Knex } = require('knex');
const { doesNotMatch } = require('assert');


const body={
    "email":"111@111",
    "password":"111"
}



describe('Test E2E de Productos', async ()=>{

    let daoTest
    let request

    before(async()=>{
        request= await supertest.agent(server)
        const session= await request.post('/api/auth/login').send(body);
        daoTest = await DaoProductos.getInstance();
        // await connection(tableName).del();
    });

    after(async()=>{
        logger.info('********* Fin TOTAL de Test *********');
        await connection.schema.dropTable(tableName);
        await connection.schema.createTable(
            tableName,
            (productosTable)=>{
                productosTable.increments();
                productosTable.string('nombre').notNullable();
                productosTable.decimal('precio', 8, 2);
                productosTable.string('thumbnail');
                productosTable.timestamps(true, true);
            })
        server.close()
    });

    it('Deberia traer una lista vacia de productos', async()=>{
        const expectedResponse={
            "productos": []
        };
        const response = await request.get('/api/productos');
        expect(response.status).to.eql(200);
        expect(response.body).to.eql(expectedResponse);
    });

    it('Deberia fallar el alta de un producto por faltar campos obligatorios', async()=>{
        const expectedResponse={
            "error": "Debe completar datos"
        }
        const bodyAltaProd={
            "nombre":"Producto Prueba FAIL",
            "thumbnail":"http://pruebaFail.jpg"
        }
        const response= await request.post('/api/productos').send(bodyAltaProd)
        expect(response.status).to.eql(400);
        expect(response.body).to.eql(expectedResponse)

    });

    it('Deberia dar de alta de un producto', async()=>{
        const expectedResponse={
            "msg": "Producto agregado ok"
        }
        const bodyAltaProd={
            "id":1,
            "nombre":"Producto Prueba OK",
            "precio":1000,
            "thumbnail":"http://pruebaOK.jpg"
        }
        const response= await request.post('/api/productos').send(bodyAltaProd)
        expect(response.status).to.eql(200);
        expect(response.body).to.eql(expectedResponse)
    });

    it('Deberia traer la lista de productos', async()=>{
        const expectedResponse={
            "productos": [{
                "id":1, 
                "nombre":"Producto Prueba OK",
                "precio": "1000.00",
                "precioUSD": (1000/config.TIPOCAMBIO_USD).toFixed(2),
                "precioFinalARS": 1000*config.IMPUESTOS_USD,
                "thumbnail":"http://pruebaOK.jpg"
            }]
        };
        const response = await request.get('/api/productos');
        expect(response.status).to.eql(200);
        expect(response.body).to.eql(expectedResponse);
    });

    it('Deberia traer el producto con Id:1', async()=>{
        const expectedResponse=[{
                "id":1, 
                "nombre":"Producto Prueba OK",
                "precio": "1000.00",
                "precioUSD": (1000/config.TIPOCAMBIO_USD).toFixed(2),
                "precioFinalARS": 1000*config.IMPUESTOS_USD,
                "thumbnail":"http://pruebaOK.jpg"
        }];
        const response = await request.get('/api/productos/1');
        expect(response.status).to.eql(200);
        expect(response.body).to.eql(expectedResponse);
    });

    it('Deberia indicar que el producto no se encuentra', async()=>{
        const expectedResponse={
            "error":"producto no encontrado"
        };
        const response = await request.get('/api/productos/100');
        expect(response.status).to.eql(404);
        expect(response.body).to.eql(expectedResponse);
    });

    it('Deberia actualizar el producto con Id:1', async()=>{
        const expectedResponse=[{
            "id":1, 
            "nombre":"TituloActualizado",
            "precio": "2000.00",
            "precioUSD": (2000/config.TIPOCAMBIO_USD).toFixed(2),
            "precioFinalARS": 2000*config.IMPUESTOS_USD,
            "thumbnail":"http://pruebaOK.jpg"
        }];
        const response= await request.put('/api/productos/1?precio=2000&&nombre=TituloActualizado');
        expect(response.status).to.eql(200);
        expect(response.body).to.eql(expectedResponse)
    });

    it('Deberia devolver que el producto a actualizar no fue encontrado', async()=>{
        const expectedResponse={
            "error":"producto no encontrado"
        }
        const response= await request.put('/api/productos/100?precio=2000&&nombre=TituloActualizado');
        expect(response.status).to.eql(404);
        expect(response.body).to.eql(expectedResponse)
    });

    it('Deberia devolver que el producto a borrar no fue encontrado', async()=>{
        const expectedResponse={
            "error":"producto no encontrado"
        }
        const response= await request.delete('/api/productos/100');
        expect(response.status).to.eql(404);
        expect(response.body).to.eql(expectedResponse)
    });

    it('Deberia borrar el producto con Id:1 y devolver la lista de productos (vacia)', async()=>{
        const expectedResponse=[];
        const response = await request.delete('/api/productos/1');
        expect(response.status).to.eql(200);
        expect(response.body).to.eql(expectedResponse);
    });



})
