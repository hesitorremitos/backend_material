import express from "express"
//import cors from "cors"
import path from 'path'

const dir = path.resolve()

// Creamos la aplicacion de express
const app = express()
// app.use(cors())


app.get('/health',(req,res)=>{
    res.status(200)
    .send("Servidor corriendo")
});


// Ruta de mensaje en formato json
app.get('/mensaje',(req, res)=>{
    res.set('Content-Type',"application/json")
    res.send(
        JSON.stringify({
            "mensajes": "Requiere de credenciales"
        })
    )
})

app.get('/',(req,res)=>{
    res.sendFile(path.join(dir,'frontend','index.html'))
})


app.listen(80, "localhost", ()=>{
    console.log("El servidor se ha iniciado");
})