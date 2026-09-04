import express from "express"
import {db,productos} from "./db.js"
const app = express()

// Procesar formularios
app.use(express.urlencoded({extended:true}))

// Usar json para parsear el cuerto
app.use(express.json())

// Servir archivos estaticos
app.use(express.static('04_septiembre/public'))

app.post('/productos',(req,res)=>{

    res.redirect('productos.html')
})

app.get('/productos', (req,res)=>{
    const datos = db.select().from(productos)
    console.log(datos)
});

app.listen(8000)