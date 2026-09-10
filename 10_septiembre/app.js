import express from 'express'
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


app.listen(3000)