import express from "express"
import cors from 'cors'
const app = express()
app.use(cors())
// Para poder recibir peticiones en json
app.use(express.json())

app.get('/health',(req,res)=>{
    res.json({
        'message':'Server is running'
    })
})

app.get('/saludo',(req,res)=>{
    res.send("Hola como estas actualizado")
})


app.get('/productos',(req,res)=>{
    const par = req.query.categoria
    const orden = req.query.orden

    res.send(`La categoria es ${par}, y el orden es ${orden}`)
})

app.post('/productos',(req,res)=>{
    const nombre = req.body.nombre
    res.set("Content-Type","text/html")
    res.send(`
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
        <h1>Mi sistema </h1>
    El producto enviado es: ${nombre}
</body>
</html>`)
})


app.post('/productos2',(req,res)=>{
    console.log(req)
    res.json(req.body)
})


app.listen(8000)