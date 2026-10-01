import {drizzle} from 'drizzle-orm/mysql2'
import { productosTable } from './schema.js'


export const db = drizzle({
    connection:{
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    },
    //schema: {productosTable}
})