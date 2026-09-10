import {drizzle} from 'drizzle-orm/mysql2'
import { productosTable } from './schema.js'


export const db = drizzle({
    connection:{
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '',
        database: '12_septiembre'
    },
    //schema: {productosTable}
})