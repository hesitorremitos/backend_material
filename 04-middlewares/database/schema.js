import {int, mysqlTable, varchar} from  'drizzle-orm/mysql-core'


export const productosTable = mysqlTable('productos',{
    id: int().primaryKey().autoincrement(),
    nombre: varchar({ length: 255}),
    precio: int()
})


