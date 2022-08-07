const {buildSchema}=require('graphql');
const {Contenedor, getProducts, validaItem, save, updateItem, generaId, getById, getAll, deleteById}=require('../controllers/productosGraphql');

const graphqlSchema = buildSchema(`
    type Query {
        getById(id: Int!): Producto,
        getAll: ListaProductos
    },
    type Mutation {
        save(nombre: String!, precio: Int!, thumbnail: String): String, 
        updateItem(id: Int!, producto: ProdInput!): Producto,
        deleteById(id: Int!): [Producto]
    },
    type ListaProductos{
        productos: [Producto]
    }
    type Producto {
        id: Int,
        nombre: String,
        precio: Float,
        precioUSD: Float,
        precioFinalARS: Float,
        thumbnail: String
    },
    input ProdInput {
        nombre: String,
        precio: Float,
        thumbnail: String
    }
`);

const graphqlRoot = {
    getById,
    getAll,
    save,
    updateItem,
    deleteById
};

module.exports={graphqlSchema,graphqlRoot}
