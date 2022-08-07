// const {guardarProducto, actualizarProducto,buscarProductoPorId,buscarProductos,borrarProductoPorId} = require("../dao/productos.mySql.dao");
const ProductosAPI = require('../api/productos');
const {logger} = require('../services/logger');

let productosDao;

ProductosAPI.getInstance().then((instance)=>{
    productosDao = instance;
});

const validaItem=(item)=>{
    let itemOK
    if (item.nombre!=undefined && parseInt(item.precio)>0){
        itemOK=true
    }else{
        itemOK=false
    }
    return itemOK
};

const save= async (args)=>{ //Recibe un objeto y lo guarda en la BD
    const item={
        nombre: args.nombre,
        precio: parseFloat(args.precio),
        thumbnail: args.thumbnail
    }
    await productosDao.guardarProducto(item)
    return 'Producto agregado ok';
};

const updateItem= async (args)=>{
    const id= args.id;
    const producto=args.producto;
    const prod= await productosDao.buscarProductoPorId(id);
    if (prod.length){
        await productosDao.actualizarProducto(id, producto);
        const prodNuevo= await productosDao.buscarProductoPorId(id);
        const prod=prodNuevo[0]
        return prod
    }else{
        return null
    }
};

  //const randomIndex =(min,max)=>{
     // return Math.floor(Math.random() * (max - min) + min);
  //};

  const generaId=()=>{
    const cantProd=this.productos.length;
    let ultimoId
    if (cantProd==0){
        ultimoId=0
    }else{
        ultimoId= this.productos[cantProd -1].id;
    }
    const idAsignado=ultimoId+1;
    return idAsignado
};

const getById=async(args)=>{ //Recibe en id y devuelve el objeto con ese id o null si no es
    const id=args.id
    const producto=await productosDao.buscarProductoPorId(id);
    const prod=producto[0]
    return prod
};

  //const getRandom=()=>{
     // const min = 0; 
     // const max = this.productos.length;
     // const idx= randomIndex(min, max);
     // return (this.productos[idx]);
  //}

const getAll= async ()=>{ //Devuelve un array con los objetos presentes en el archivo 
      //const options = optionsMySQL;
      //this.connection = knex(options);
    // const listaProductos= {productos: await productosDao.buscarProductos()}
    // return listaProductos

    try{
        // const prodDB= await Contenedor.init();
        // let prods = await Contenedor.getAll();
        listaProductos= {productos: await productosDao.buscarProductos()}//new Producto(prods);
        logger.info(`Productos recuperados`)
        return listaProductos
    }
    catch(err){
        logger.error(`Error al recuperar los productos - ${err}`)
        return ({productos: `${err}`})
    }


};

const deleteById=async (args)=>{ // Elimina del archivo el objeto con el id buscado
    const id=args.id
    const prod= await productosDao.buscarProductoPorId(id)
    if (prod.length){
        await productosDao.borrarProductoPorId(id);
        const listaProductos= await productosDao.buscarProductos()
        return (listaProductos);
    }else{
        return null
    }
};


// module.exports = router;

// const Contenedor = new Producto();

const getProducts = async (req,resp, next)=>{
    try{
        // const prodDB= await Contenedor.init();
        // let prods = await Contenedor.getAll();
        listaProductos= {productos: await productosDao.buscarProductos()}//new Producto(prods);
        logger.info(`Productos recuperados`)
        next()
    }
    catch(err){
        logger.error(`Error al recuperar los productos - ${err}`)
        resp.json({msg: `${err}`})
    }
}
const Contenedor = {validaItem, save, updateItem, generaId, getById, getAll, deleteById}
module.exports= {Contenedor, getProducts, validaItem, save, updateItem, generaId, getById, getAll, deleteById}