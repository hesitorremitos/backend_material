import express from "express"
import mysql from 'mysql'


const app = express()
var db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: '04_septiembre'
})
// Procesar formularios
app.use(express.urlencoded({extended:true}))

// Usar json para parsear el cuerto
app.use(express.json())

// Servir archivos estaticos
app.use(express.static('04_septiembre/public'))

app.post('/productos',(req,res)=>{
    //console.log(req.body)

    db.query(
        `INSERT INTO productos values('${req.body.nombre}',${req.body.precio})`, (error, res, fields)=>{
        if (error) throw error;
        console.log(res)
    })
    res.redirect('productos.html')
})

app.get('/productos', (req,res)=>{
    
    let productos = []
    db.query("SELECT * FROM productos", (error, response, fields)=>{
        if (error) throw error;
        console.log(res)
        res.json({
            mensaje: "Lista de productos",
            data: response
        })
    })

});

app.listen(8000)