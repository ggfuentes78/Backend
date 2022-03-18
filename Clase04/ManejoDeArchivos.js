const fs = require('fs/promises');
const file='./productos.txt';
const fileTest='./productos_test.txt';


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
        await fs.writeFile(file, productosStringified)
    };

    getById(id){ //Recibe en id y devuelve el objeto con ese id o null si no esta
        const producto = this.productos.find(e=>e.id===id)
        if (producto){
            return producto
        }else{
            return null
        }
    }
    
    static getAll(){ //Devuelve un arrayon los objetos presentes en el archivo 
        return fs.readFile(file, 'utf-8')
       }
    
    async deleteById(id){ // Elimina del archivo el objeto con el id buscado
        const idIndex = this.productos.findIndex((e)=>e.id===id)
        if (idIndex > -1){
            this.productos.splice(idIndex,1)
            const productosStringified = JSON.stringify(this.productos, null, '\t');
            await fs.writeFile(file, productosStringified)
        }else{
            console.log('No se encontro el id solicitado', id)
        }

    }

    async deleteAll(){ // Elimina todos los objetos presentes en el archivo
        this.productos.length=0//.splice(0, this.productos.length)
        const productosStringified = JSON.stringify(this.productos, null, '\t');
        await fs.writeFile(file, productosStringified)
    }
}

const main = async()=>{

try{
    let prods = await Contenedor.getAll(file);
    let prodsJson = JSON.parse(prods)

    const productos= new Contenedor(prodsJson);
    console.log('Resultado getAll:', productos);

    console.log('Resultado de getById:', productos.getById(3));

    await productos.deleteById(8);
    console.log('Resultado de delteById:', productos);

    await productos.deleteById(3);
    console.log('Resultado de delteById:', productos);

    await productos.save(
        {
        "title": "Sekiro: Shadows Die Twice",
        "price": 1500,
        "thumbnail": "https://store-images.s-microsoft.com/image/apps.6747.69038865179152125.ddcc0d78-9e3a-4110-94b3-6df63908553a.95db2b1e-f9fd-4049-b1af-cb6e4a144713?w=310"
        })

    console.log('Resultado save', productos)

    await productos.deleteAll();
    console.log('Resultado de deleteAll:', productos)
    
    await productos.save(
        {
        "title": "Mortal Kombat 11",
        "price": 750,
        "thumbnail": "https://store-images.s-microsoft.com/image/apps.63277.70804610839547354.8da93c46-fd13-4b16-8ebe-e8e02c53d93e.9d395244-d5c3-4d17-a83d-2ff95537c0f6?w=310"
        })
    
    await productos.save(
        {
        "title": "Far Cry 5",
        "price": 950,
        "thumbnail": "https://store-images.s-microsoft.com/image/apps.48705.69582963086497758.e1cff2e3-ddf1-42bf-930d-f380ad63f100.1eb992fd-461c-4edd-9e5e-b3fbb7a41044?w=310"
        })
    
    console.log('Resultado save', productos)

    prods = await Contenedor.getAll(file);
    prodsJson = JSON.parse(prods)
    const productos2= new Contenedor(prodsJson);
    console.log('Resultado getAll del archivo actualizado:', productos2);
    }

catch(err){
        console.log("Error al leer el archivo",err);
}
}

main()
.then(()=>{
    console.log('Proceso exitoso!');
})
.catch((err)=>{
    console.log('Error en la ejecucion')
})
.finally(()=>{
    console.log('fin del proceso')
})

