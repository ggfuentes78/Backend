const express =require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs/promises');
const { response } = require('express');


const file='../../public/productos.txt';
const fileTest='../../public/productos_test.txt';
const ruta= path.resolve(__dirname, file);

const randomIndex = (min,max) =>{
    return Math.floor(Math.random() * (max - min) + min);
};

class Contenedor{
    productos;

    constructor (prods){
        this.productos = prods;
    }
    
    async save(item){ //Recibe un objeto y lo guarda en el archivo
        this.productos.push(item)
        const productosStringified = JSON.stringify(this.productos, null, '\t');
        await fs.writeFile(ruta, productosStringified)
    };

    async updateItem(producto){
        const indice = this.productos.findIndex(e=>e.id==producto.id)
        this.productos.splice(indice, 1, producto)
        const productosStringified = JSON.stringify(this.productos, null, '\t');
        await fs.writeFile(ruta, productosStringified)
    };

    generaId(){
        const cantProd=this.productos.length;
        let ultimoId
        if (cantProd==0){
            ultimoId=0
        }else{
            ultimoId= this.productos[cantProd -1].id;
        }
        const idAsignado=ultimoId+1;
        return idAsignado
    }

    getById(id){ //Recibe en id y devuelve el objeto con ese id o null si no esta
        const producto = this.productos.find(e=>e.id==id)
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
        const idIndex = this.productos.findIndex((e)=>e.id==id)
        if (idIndex > -1){
            this.productos.splice(idIndex,1)
            const productosStringified = JSON.stringify(this.productos, null, '\t');
            await fs.writeFile(ruta, productosStringified)
            console.log(this.productos)
            return(this.productos)
        }else{
            return null
        };

    };

    async deleteAll(){ // Elimina todos los objetos presentes en el archivo
        this.productos.length=0;
        const productosStringified = JSON.stringify(this.productos, null, '\t');
        await fs.writeFile(ruta, productosStringified)
    };
};

let productos

const mwProductos = async (req,resp, next)=>{
    try{
        let prods = await Contenedor.getAll(ruta);
        let prodsJson = JSON.parse(prods);
        productos= new Contenedor(prodsJson);
        next()
    }
    catch(err){
        console.log('Error al recuperar los productos', err)
        resp.json({msg: err})
    }
}

router.get('/', mwProductos, (request, response)=>{
        response.json(productos)
});

router.get('/:id', mwProductos, (request, response)=>{
    const id = request.params.id;
    let producto
    if (id=='random'){
        producto=productos.getRandom();
    }else{
        producto=productos.getById(id);
    }
    if (producto!=null){
        console.log(producto);
        response.json(producto)
    }else{
        response.status(404).json({
            error : 'producto no encontrado' 
        })
    }
})

router.post('/',mwProductos, (request, response)=>{
    const idAsignado= productos.generaId();
    const body= request.body;
    console.log('body',body)
    const query =response.query;
    console.log('query', query)
    const item= {
        nombre: body.nombre,
        price: body.price,
        thumbnail: body.thumbnail,
        id: idAsignado
    }
    productos.save(item);
    response.json(item)
});

router.delete('/:id', mwProductos, async(request, response)=>{
    const id = request.params.id;
    const prods=await productos.deleteById(id);
    console.log('prods', prods)
    if (prods!=null){
        response.json(prods)
    }else{
        response.status(404).json({error : 'producto no encontrado'})
    }
});

router.put('/:id', mwProductos, (request, response)=>{
    const id = request.params.id;
    const itemNewData= request.query;
    let producto=productos.getById(id);
    if (producto != null){
        console.log(producto);
        Object.assign(producto, itemNewData);
        productos.updateItem(producto);
        console.log(producto);
        response.json(producto);
    }else{
        response.status(404).json({error : 'producto no encontrado'});
    }
});

module.exports = router;