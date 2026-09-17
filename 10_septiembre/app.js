import express from 'express'
import { eq } from 'drizzle-orm'
import { db } from './database/index.js'
import { productosTable } from './database/schema.js'

const app = express()

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use(express.static("10_septiembre/public"))


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

    console.log(result)
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

    console.log(producto.length)
    if(producto.length<1){
        return res.json({mensaje: "El producto no existe"})
    }

    // Eliminacion en la base de datos
    const result = await db.delete(productosTable)
        .where(eq(productosTable.id, id))

    console.log(result)
    
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
    console.log(result[0].affectedRows)

    res.json({
        mensaje: "Producto actualizado",
        datos: {id, nombre, precio}
    })
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

    console.log(result)
    res.redirect("/index.html")
})
app.listen(3000)