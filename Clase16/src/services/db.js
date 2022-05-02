const knex = require('knex');
const optionsSQLite =require('../../options/sqlite3');

class DB{
    constructor(){
        const options = optionsSQLite;
        this.connection = knex(options);
    }

    init() {
        this.connection.schema.hasTable('chatHistoria').then((exists)=>{
            if(exists) {
                return
            } else {
                return this.connection.schema.createTable(
                    'chatHistoria',
                    (chatHistoriaTable) =>{
                        chatHistoriaTable.increments();
                        chatHistoriaTable.string('email').notNullable();
                        chatHistoriaTable.timestamps(true, true);
                    }
                )
            }
        
        })
    }
    
    getData(tableName, id){
        if (id) {
            return this.connection(tableName).where('id',id);
        };

        return this.connection(tableName);
    }

    create(tableName, data) {
        return this.connection(tableName).insert(data);
    }
    
    update(tableName, id, data) {
        return this.connection(tableName).where('id', id).update(data);
    }

    delete(tableName, id) {
        return this.connection(tableName).where('id', id).del();
    }
};

// const  DBService = new DB();
// DBService.init();
// module.exports= DBService ;
module.exports=DB;
