const ClienteAxiosProductos = require('./clienteAxiosProductos');
const { logger } = require('../services/logger');

const init=async()=>{
//login para iniciar sesion
await ClienteAxiosProductos.login({"email":"111@111", "password":"111"})


//busca todos los productos
await ClienteAxiosProductos.buscarProductos();

//busca un producto existente
await ClienteAxiosProductos.buscarProductos(4);

//busca un producto inexitente
await ClienteAxiosProductos.buscarProductos(666);

//Alta de Producto
await ClienteAxiosProductos.agregarProducto({"nombre":"Prueba Axios OK", "precio":1000});

//Alta Fallida
await ClienteAxiosProductos.agregarProducto({"nombre":"Prueba Axios FAIL"});

//Modificacion de Producto
await ClienteAxiosProductos.actualizarProducto(45, "nombre=NombreActualizadoPrueba&&precio=500");

//Borrar Producto
await ClienteAxiosProductos.eliminarProducto(47);

// Falla al eliminar producto inexistente;
await ClienteAxiosProductos.eliminarProducto(47);

//Falla al modificar Producto inexistente
await ClienteAxiosProductos.actualizarProducto(26, {"nombre":"NombreActualizadoPruebaFail"});


}

init()

