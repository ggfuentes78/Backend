const { logger } = require('../../../services/logger');
const ProductosDTO= require('../dto/productos');

const productos = [
    {
        "nombre": "Elden Ring",
        "precio": 2999,
        "thumbnail": "https://store-images.s-microsoft.com/image/apps.45643.14537704372270848.6ecb6038-5426-409a-8660-158d1eb64fb0.65bbc29b-4f5d-4381-a62a-9b6178d2f342?w=310",
        "id": 1
    },
    {
        "nombre": "FIFA 22",
        "precio": 2500,
        "thumbnail": "https://store-images.s-microsoft.com/image/apps.27325.13903780539574593.941766d2-e738-4026-9276-dc9d06c9e9ac.0461ec06-49f4-454d-a8aa-e028b70c2362?w=310",
        "id": 2
    },
     {
     "nombre": "Star Wars Jedi: Fallen Order",
     "precio": 650,
     "thumbnail": "https://store-images.s-microsoft.com/image/apps.52300.65392999590663672.028b6875-f925-4d40-b3a1-e44db3b4fa32.7bcb3d0f-46fc-43ea-84d1-031bd0817da2?w=310",
     "id": 3
    }
]

class DaoProductos{
    static instance;
    productos;

    constructor (){
        this.productos = productos;
    }

    static async getInstance(){
        if (!DaoProductos.instance){
            logger.info('Inicializando DAO Productos- MEM');
            DaoProductos.instance= new DaoProductos();
        }
        return DaoProductos.instance;
    }

    async guardarProducto(item){ //Recibe un objeto, lo guarda en el archivo, devuelve el ids asignado
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
        return idAsignado
    };

    async actualizarProducto(id, producto){
        const indice = this.productos.findIndex(e=>e.id==id);
        Object.assign(this.productos[indice], producto)
    };

    buscarProductoPorId(id){ //Recibe en id y devuelve el objeto con ese id o null si no esta
        const producto = this.productos.find(e=>e.id==id)
        if (producto){
            return new ProductosDTO(producto)
        }else{
            return null
        }
    };
    

    buscarProductos(){ //Devuelve un arrayon los objetos presentes en el archivo 
        return this.productos.map((prod)=> new ProductosDTO(prod));
    };
    
    async borrarProductoPorId(id){ // Elimina del archivo el objeto con el id buscado
        const idIndex = this.productos.findIndex((e)=>e.id==id)
        if (idIndex > -1){
            this.productos.splice(idIndex,1)
        }else{
            logger.info(`No se encontro el id solicitado: ${id}`)
        };

    };
}

// const Productos= DaoProductos.getInstance()

module.exports= DaoProductos

