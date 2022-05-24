const express =require('express');
const optionsMySQL = require('../options/mariaDB');
const knex = require('knex')(optionsMySQL);

class ImportarProductos{
    
    static async llenarTablaProductos(ruta, connectionDB){
        const prods=[
            { nombre: "Elden Ring", precio: 2999, thumbnail: "https://store-images.s-microsoft.com/image/apps.45643.14537704372270848.6ecb6038-5426-409a-8660-158d1eb64fb0.65bbc29b-4f5d-4381-a62a-9b6178d2f342?w=310"},
            {nombre: "FIFA 22",precio: 2500,thumbnail: "https://store-images.s-microsoft.com/image/apps.27325.13903780539574593.941766d2-e738-4026-9276-dc9d06c9e9ac.0461ec06-49f4-454d-a8aa-e028b70c2362?w=310"},
            {nombre: "Star Wars Jedi: Fallen Order", precio: 650, thumbnail: "https://store-images.s-microsoft.com/image/apps.52300.65392999590663672.028b6875-f925-4d40-b3a1-e44db3b4fa32.7bcb3d0f-46fc-43ea-84d1-031bd0817da2?w=310"},
            {nombre: "Pac-Man Championship", precio: 150, thumbnail: "https://store-images.s-microsoft.com/image/apps.40670.68156636091184303.90215747-29c9-49f6-8d66-b2fe8d102bd9.1527f8dd-a233-44d0-8405-4fc33f6b9d7e?w=310"},
            {nombre: "Sonic Mania", precio: 1000, thumbnail: "https://store-images.s-microsoft.com/image/apps.30729.63115756613719781.d2d76a5d-bdd8-43f1-b57a-94ed7313dd94.82ae86f2-bf96-48ec-bd82-f79e488f1df8?w=310"},
            {nombre: "World of Tanks", precio: 200, thumbnail: "https://store-images.s-microsoft.com/image/apps.25258.67082279703731056.02d56beb-5f8c-4880-8dfd-de8ce11ec794.29e614b1-071a-4cd3-a6fb-4b976c752c99?w=310"},
            {nombre: "RE7", precio: 800, thumbnail: "https://store-images.s-microsoft.com/image/apps.35598.13510798887575711.1cbf762b-fd7f-4e21-a1e2-d03d474899cb.93275dc8-a361-4ed2-9fef-70a11a314395?w=310"},
            {nombre: "Resident Evil 8", precio: 3500, thumbnail: "https://store-images.s-microsoft.com/image/apps.21384.13809253632566266.a1f3ac36-ddef-4b21-8956-5d5668ac9650.fdf71def-317c-4d65-8737-9ce6273b23fb?w=310"},
            {nombre: "Cuphead", precio: 500, thumbnail: "https://store-images.s-microsoft.com/image/apps.22008.13670972585585116.b194a7d4-ad8d-4e23-ab53-349c6d12eba0.92dfce54-5825-4bc5-a546-cb36bcd292fe?w=310"},
            {nombre: "Minecraft", precio: 600, thumbnail: "https://store-images.s-microsoft.com/image/apps.13222.13510798887677013.1077fa20-ea39-4722-a9c2-5f072733521f.16fb32c5-3c41-4d90-a6c8-21090c01cf10?w=310"},
            {nombre: "GTAV", precio: 1500, thumbnail: "https://store-images.s-microsoft.com/image/apps.7814.68565266983380288.0f5ef871-88c0-45f7-b108-6aacbc041fcf.b7e42789-b2bf-4b60-bf0a-f891f2f04226?w=310"},
            {nombre: "Rocket League", precio: 100, thumbnail: "https://store-images.s-microsoft.com/image/apps.14433.65187692735347017.69f420fe-c0e3-4701-ba5a-24b0f25e7697.30b7054b-d418-4e2e-840c-0cd62a41cd41?w=310"}
        ]

        knex('productos')
            .insert(prods)
            .then(()=>console.log('Productos Importados'))
            .catch((err)=>console.log('Error:', err))
            .finally(()=>knex.destroy());                
    }
}

module.exports= ImportarProductos;