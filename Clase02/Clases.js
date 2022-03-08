class Usuario{
    nombre;
    apellido;
    libros;
    mascotas;

    constructor (input_nombre, input_apellido, input_libros, input_mascotas){
        this.nombre = input_nombre;
        this.apellido = input_apellido;
        this.libros = input_libros;
        this.mascotas = input_mascotas;
    }

    getFullName(){
        return (`${this.nombre} ${this.apellido}`);
    }

    addMascota(mascota){
        this.mascotas.push(mascota);
    }

    countMascotas(){
        return (this.mascotas.length);
    }

    addBook(pNombre, pAutor){
        this.libros.push({nombre: pNombre, autor: pAutor});
    }

    getBookNames(){
        let listaLibros=[]
        this.libros.forEach(e => {
            listaLibros.push(e.nombre)});
        return (listaLibros);
    }
}

function muestraMascotas(user){
    if (user.countMascotas()===0){
        console.log(`${user.getFullName()} no tiene mascotas`);
    }else{
        console.log(`${user.getFullName()} tiene ${user.countMascotas()} mascotas`);
    }
}

const user1 = new Usuario ('Gustavo', 'Fuentes', [{nombre:'La torre oscura I' , autor:'Stephen King'},{nombre:'Ready player one', autor:'Ernest Cline'}], ['perro', 'gato']);
const user2 = new Usuario ('Marcela', 'Cosentino', [{nombre:'El caballero de la armadura oxidada' , autor:'Robert Fisher'}], []);

muestraMascotas(user1);
muestraMascotas(user2);

user1.addMascota('pez');
user1.addMascota('iguana');

muestraMascotas(user1);

console.log(`Libros de ${user1.getFullName()}: ${user1.getBookNames()}`);
console.log(`Libros de ${user2.getFullName()}: ${user2.getBookNames()}`);

user2.addBook('El idioma de los gatos','Spencer Holst')

console.log(`Libros de ${user2.getFullName()}: ${user2.getBookNames()}`);

