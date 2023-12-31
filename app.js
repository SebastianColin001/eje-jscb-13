const express = require ('express');
const hbs= require('hbs'); 
const bodyParser = require ('body-parser'); 
const cors= require('cors'); 
const port =process.env.PORT || 3000; 
//rutas personalizadas
const rutasCategoriasAPI =require ('./src/routes/categorias-routes-api'); 
const rutasUsuariosAPI=require('./src/routes/usuarios-routes-api'); 
const rutasAuthAPI=require('./src/routes/auth-routes-api')
const app= express(); 

app.set('view engine','hbs'); 
hbs.registerPartials(__dirname+'/views/partials',()=>{});

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true})); 
app.use(bodyParser.json()); 
app.use(cors()); 


//definir rutas: login, categorias, index, not foud 
app.get('/',(req,res)=>{
    res.render('index')
});

app.get('/login',(req,res)=>{
    res.render('signup-one')
});

//me regresaen formato json los datos de categoria
app.use('/categorias/api', rutasCategoriasAPI);
app.use('/usuarios/api',rutasUsuariosAPI); 
app.use('/auth/api',rutasAuthAPI);

app.get('/categorias',(req,res)=>{
    res.render('advance-table')
});

app.get('*',(req,res)=>{
    res.render('404');
});

//definir puerto que escucha solicitudes 
app.listen(port,()=>{
    console.log('el servidor está corriendo en el puerto: '+port); 
})