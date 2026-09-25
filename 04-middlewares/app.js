import express from 'express'
import path from 'path'
import productosRouter from './routes/productos.js'
import { time } from 'drizzle-orm/mysql-core'
const app = express()

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use(express.static(path.join(import.meta.dirname, "public")))


app.use((req,res,next)=>{
    // Obteniendo la fecha y hora actual
    const inicio = Date.now()
    const timestamp = new Date().toLocaleString()
    res.on('finish',()=>{
        const duracion = Date.now() - inicio
    console.log(`${timestamp} ${req.method}: ${req.originalUrl} ${duracion}ms`)

    })
    next()
})
app.use('/', productosRouter.router)

app.listen(3000)