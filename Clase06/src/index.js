const express = require('express');
const path = require('path');
const fs = require('fs/promises');
// const { response } = require('express');

const file='./productos.txt';
const fileTest='./productos_test.txt';
const rutaHome = path.resolve(__dirname, './views/index.html')
const ruta= path.resolve(__dirname, file);

const aplicacion = express();
const puerto = 8080;

const servidor = aplicacion.listen(puerto,()=>{
    console.log("Server Listo. Escuchando en el puerto", puerto)
});

servidor.on('error', (err)=>{
    console.log('Hubo un error', err)
});

const randomIndex = (min,max) =>{
    return Math.floor(Math.random() * (max - min) + min);
};

class Contenedor{
    productos;

    constructor (prods){
        this.productos = prods;
    }

    async save(item){ //Recibe un objeto, lo guarda en el archivo, devuelve el ids asignado
        const cantProd=this.productos.length;
        let ultimoId
        if (cantProd==0){
            ultimoId=0
        }else{
            ultimoId= this.productos[cantProd -1].id;
        }
        const idAsignado=ultimoId+1;
        item.id= idAsignado
        this.productos.push(item)
        const productosStringified = JSON.stringify(this.productos, null, '\t');
        await fs.writeFile(ruta, productosStringified)
        return idAsignado
    };

    getById(id){ //Recibe en id y devuelve el objeto con ese id o null si no esta
        const producto = this.productos.find(e=>e.id===id)
        if (producto){
            return producto
        }else{
            return null
        }
    };
    
    getRandom(){
        const min = 0; 
        const max = this.productos.length;
        const idx= randomIndex(min, max);
        return (this.productos[idx]);
    }

    static getAll(){ //Devuelve un arrayon los objetos presentes en el archivo 
        return fs.readFile(ruta, 'utf-8')
    };
    
    async deleteById(id){ // Elimina del archivo el objeto con el id buscado
        const idIndex = this.productos.findIndex((e)=>e.id===id)
        if (idIndex > -1){
            this.productos.splice(idIndex,1)
            const productosStringified = JSON.stringify(this.productos, null, '\t');
            await fs.writeFile(ruta, productosStringified)
        }else{
            console.log('No se encontro el id solicitado', id)
        };

    };

    async deleteAll(){ // Elimina todos los objetos presentes en el archivo
        this.productos.length=0;
        const productosStringified = JSON.stringify(this.productos, null, '\t');
        await fs.writeFile(ruta, productosStringified)
    };
};

aplicacion.get('/', (request, response)=>{
    response.sendFile(rutaHome);
});

aplicacion.get('/productos', async (request, response)=>{
    try{
        let prods = await Contenedor.getAll(ruta);
        let prodsJson = JSON.parse(prods);
        const productos= new Contenedor(prodsJson);
        response.json(productos)
    }
    catch(err){
        console.log('Error al recuperar los productos', err)
    }
});

aplicacion.get('/productoRandom', async(request, response)=>{
    try{
        let prods = await Contenedor.getAll(ruta);
        let prodsJson = JSON.parse(prods);
        const productos= new Contenedor(prodsJson);
        response.json(productos.getRandom());
    }
    catch(err){
        console.log('Error al recuperar los productos', err)
    }
});