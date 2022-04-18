const socketIo = require ('socket.io');
const Contenedor = require('../utils/contenedor');
const ChatHistoria = require('../utils/chatHistoria');
const { getAll } = require('../utils/contenedor');

const listaChat= async()=>{
    try{
        let mensajes = await ChatHistoria.getChats();
        let mensajesJson = JSON.parse(mensajes);
        listaMensajes= new ChatHistoria(mensajesJson);
        return listaMensajes
    }
    catch(err){
        console.log('Error al recuperar los mensajes', err)
        resp.json({msg: err})
    }
}

const Productos = async ()=>{
    try{
        let prods = await Contenedor.getAll();
        let prodsJson = JSON.parse(prods);
        produc= new Contenedor(prodsJson);
        return produc
    }
    catch(err){
        console.log('Error al recuperar los productos', err)
        resp.json({msg: err})
    }
}


const initWsServer = (server) => {
    io = socketIo(server);
  
    io.on('connection', async (socket) => {
      console.log('Nueva Conexion establecida!');
      const listaMensajes = await listaChat();
      if (listaMensajes.mensajes.length>0){
        socket.emit('listaMensajes', listaMensajes.mensajes)
      } 
    //Recibo una linea Nueva
      socket.on('altaProducto', async () => {
        console.log('Se agrego un producto');
        const productos= await Productos();
        
        io.emit('nuevoProducto', productos);
      });

      socket.on('nuevoMensaje', async (data)=>{
            console.log(data);
            const listaMensajes= await listaChat()
            console.log('nuevo mensaje' ,listaMensajes)
            await listaMensajes.save(data)
            console.log(listaMensajes)
            console.log(listaMensajes);
            io.emit('listaMensajes', listaMensajes.mensajes)
      })
    
    return io;
    })};
  
  module.exports = {
    initWsServer,
  };