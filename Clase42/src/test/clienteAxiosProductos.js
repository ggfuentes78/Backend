const axios=require('axios');
const { CookieJar } = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');

const { modeloUser } = require('../models/users/users');
// const cliente= require('../services/persistent-client')


const jar = new CookieJar();
const cliente = wrapper(axios.create({ jar }));

class ClienteAxiosProductos{

    static async login(user){
        try{
            return await cliente.post('http://localhost:8080/api/auth/login', user)
        }catch(err){
            console.log(err)
        }
    }

    static async buscarProductos(id){
        let resp
        try{
            if(id){
                // const session= await ClienteAxiosProductos.login({"email":"111@111","password":"111"})
                // const headers= {headers: session.headers['set-cookie'][0]}
                resp = await cliente.get(`http://localhost:8080/api/productos/${id}`)
            }else{
                // const session= await ClienteAxiosProductos.login({"email":"111@111","password":"111"})
                resp= await cliente.get('http://localhost:8080/api/productos')
            }
            console.log(resp.data)
        }catch(err){
            console.log(err.response.data)
        }
    }

    static async agregarProducto(item){
        let resp
        try{
            resp=await cliente.post('http://localhost:8080/api/productos', item)
        }catch(err){
            console.log(err.response.data)
        }
    }

    static async eliminarProducto(id){
        let resp
        try{
            resp=await cliente.delete(`http://localhost:8080/api/productos/${id}`)
        }catch(err){
            console.log(err.response.data)
        }
    }
    
    static async actualizarProducto(id, nuevosDatos){
        let resp
        try{
            resp=await cliente.put(`http://localhost:8080/api/productos/${id}?${nuevosDatos}`)
        }catch(err){
            console.log(err.response.data)
        }
    }        
    





}

module.exports= ClienteAxiosProductos