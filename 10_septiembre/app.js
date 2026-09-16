import express from 'express'
import { eq } from 'drizzle-orm'
import { db } from './database/index.js'
import { productosTable } from './database/schema.js'

const app = express()

app.use(express.urlencoded({extended: true}))
app.use(express.json())



app.get('/productos',(req,res)=>{
    db.select().from(productosTable).then((datos)=>{
        console.log(datos)
        res.json({
            mensaje: "Lista de productos",
            datos: datos
        })
    })
    console.log("HOLA mundo")
})

app.get('/productos2',async (req,res)=>{
    // Esperando la respuesta de la base de datos
    const productos = await db.select().from(productosTable)
    res.json({
        mensaje: "Lista de productos",
        datos: productos
    })
})

app.post('/productos', async (req, res) => {
    const { nombre, precio } = req.body
    if (!nombre || precio == null) {
        return res.status(400).json({ mensaje: "nombre y precio son requeridos" })
    }
    // Insersion y recuperacion del ID
    const [{ id }] = await db.insert(productosTable).values({ nombre, precio: Number(precio) }).$returningId()
    const [producto] = await db.select().from(productosTable).where(eq(productosTable.id, id))
    res.status(201).json({ mensaje: "Producto creado", datos: producto })
})

app.delete('/productos/:id', async (req, res) => {
    const id = Number(req.params.id)
    if (!id) return res.status(400).json({ mensaje: "id inválido" })
    const [producto] = await db.select().from(productosTable).where(eq(productosTable.id, id))
    if (!producto) return res.status(404).json({ mensaje: "Producto no encontrado" })
    await db.delete(productosTable).where(eq(productosTable.id, id))
    res.json({ mensaje: "Producto eliminado", datos: producto })
})

app.listen(3000)