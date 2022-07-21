const connection = require('../../../services/dbProductos');
const tableName = 'productos';
const {logger} = require ('../../../services/logger');
const ProductosDTO= require('../dto/productos');


class DaoProductos{
        // connection;
        // tableName;
        static instance;
        productos;

               
        // constructor(conn, table){
                // this.connection=conn;
                // this.tableName=table
                // this.productos= async () => await DaoProductos.buscarProductos()
                // const aaa= this.productos
                // console.log('ppp', aaa)
        // }
        static async getInstance(){
                if(!DaoProductos.instance){
                        // connection=await ConnectionProds.init();
                        logger.info('Inicializando DAO SQL de Productos');
                        DaoProductos.instance= new DaoProductos();
                        // this.connection=connection;
                        console.log('dPI',this.instance)
                }
                return DaoProductos.instance;
        }
        
        
        async guardarProducto(item) { //Recibe un objeto y lo guarda en la BD
                return await connection(tableName).insert(item);
        };

        async actualizarProducto (id, producto){
                await connection(tableName).where('id', id).update(producto);
                return 
        };

        async buscarProductoPorId(id){ //Recibe en id y devuelve el objeto con ese id o null si no esta
                const producto=await connection(tableName).where('id', id);
                return producto.map((prod)=> new ProductosDTO(prod))
         };

        async buscarProductos(){ //Devuelve un array con los objetos presentes en el archivo 
                const listaProductos= await connection(tableName)
                return listaProductos.map((prod)=> new ProductosDTO(prod));
        };
        
        async borrarProductoPorId(id){ // Elimina del archivo el objeto con el id buscado
                    await connection(tableName).where('id',id).del();
                    return {msg: 'Elemento borrado'}
        };
};

// const Productos = new DaoProductos()
// const Productos = DaoProductos.getInstance()

module.exports= DaoProductos
// module.exports={guardarProducto, actualizarProducto,buscarProductoPorId,buscarProductos,borrarProductoPorId}