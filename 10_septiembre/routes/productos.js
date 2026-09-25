import { eq } from 'drizzle-orm'
import { db } from '../database/index.js'
import { productosTable } from '../database/schema.js'
import express from 'express'
// Crear enrutador express
const app = express.Router()

app.get('/productos',(req,res)=>{
    db.select().from(productosTable).then((datos)=>{
        res.json({
            mensaje: "Lista de productos",
            datos: datos
        })
    })
})

app.get('/productos2',async (req,res)=>{
    // Esperando la respuesta de la base de datos
    const productos = await db.select().from(productosTable)
    res.json({
        mensaje: "Lista de productos",
        datos: productos
    })
})

// Creacion del producto
/*
- POST tiene body
*/

app.post('/productos', async (req,res)=>{
    const nombre = req.body.nombre
    const precio = req.body.precio

    // Validar los datos
    if(!nombre || !precio){
        return res.json({
            mensaje: "Cuerpo incorrecto",
        })
    }

    // Insersion en la DB
    const result = await db.insert(productosTable).values({
        nombre,
        precio: Number(precio)
    }).$returningId()


    // Seleccionar el nuevo producto insertado
    const producto = await db.select().from(productosTable)
        .where(eq(productosTable.id, result[0].id))

    res.json({
        mensaje: "Producto creado",
        datos: producto,
    })
})

// Eliminacion de producto
// - Requerimos ID
app.delete("/productos/:id",async (req,res)=>{
    const id = Number(req.params.id)
    // Validacion
    if(Number.isNaN(id)){
        return res.json({
            mensaje: "Id no valido"
        })
    }

    // Validar que el producto exista
    const producto = await db.select().from(productosTable)
        .where(eq(productosTable.id,id))

    if(producto.length<1){
        return res.json({mensaje: "El producto no existe"})
    }

    // Eliminacion en la base de datos
    const result = await db.delete(productosTable)
        .where(eq(productosTable.id, id))

    
    res.json({
        mensaje:"producto eliminado",
        datos: id
    })
})


// PATH (ACTUALIZAR solamente campos especificos)
// PUT (ACTUALIZAR TODO el producto)

app.put("/productos/:id",async(req,res)=>{
    const id = Number(req.params.id)
    // Validacion
    if(Number.isNaN(id)){
        return res.json({
            mensaje: "Id no valido"
        })
    }

    // Validar que el producto exista
    const producto = await db.select().from(productosTable)
        .where(eq(productosTable.id,id))

    if(producto.length<1){
        return res.json({mensaje: "El producto no existe"})
    }

    // Validar los nuevos datos
    const nombre = req.body.nombre
    const precio = req.body.precio

    // Validar los datos
    if(!nombre || !precio){
        return res.json({
            mensaje: "Cuerpo incorrecto",
        })
    }


    // Actializacion del producto
    const result = await db.update(productosTable)
        .set({nombre,precio})
        .where(eq(productosTable.id,id))

    res.redirect("/index.html")
})


app.post("/productoform",async (req,res)=>{
    const nombre = req.body.nombre
    const precio = req.body.precio

    // Validar los datos
    if(!nombre || !precio){
        return res.json({
            mensaje: "Cuerpo incorrecto",
        })
    }

    // Insersion en la DB
    const result = await db.insert(productosTable).values({
        nombre,
        precio: Number(precio)
    }).$returningId()


    // Seleccionar el nuevo producto insertado
    const producto = await db.select().from(productosTable)
        .where(eq(productosTable.id, result[0].id))

    res.redirect("/index.html")
})

// Responder con un producto en especifico
app.get("/productos/:id",async  (req,res)=>{
    const id = Number(req.params.id)
    // Validacion
    if(Number.isNaN(id)){
        return res.json({
            mensaje: "Id no valido"
        })
    }

    // Validar que el producto exista
    const producto = await db.select().from(productosTable)
        .where(eq(productosTable.id,id))
    if(producto.length<1){
        return res.json({mensaje: "El producto no existe"})
    }
    
    res.json({
        mensaje:"Producto encontrado",
        datos: producto[0]
    })
})


export default {
    router: app,
}