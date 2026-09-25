import { drizzle } from "drizzle-orm/mysql2";
import { int, mysqlTable, varchar } from "drizzle-orm/mysql-core";


const productos = mysqlTable('productos',{
    nombre: varchar({length: 100}),
    precio: int()
})



const db = drizzle({
    connection:{
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '',
        database: '04_septiembre'
    }
})

export {
    productos,
    db
}