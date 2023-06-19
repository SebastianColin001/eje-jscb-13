const express =require('express')
const categoriasControllerAPI =require('../controllers/categorias-controller-api')
const router =express.Router(); 

//la ruta (end Point) GET de todas las categorias
router.get('/', categoriasControllerAPI.getTodas); 

//la ruta (end Point) GET solo una categoría 
router.get('/:id',categoriasControllerAPI.getCategoriaById);

//la ruta (end point) AGREGAR=POST de una categoria 
router.post("/",categoriasControllerAPI.agregarCategoria); 

//la ruta (end point) ACTUALIZAR=PUT una categoria 
router.put("/:id",categoriasControllerAPI.updateCategoria);

//la ruta (end Point) DELETE solo una categoría
router.delete('/:id',categoriasControllerAPI.deleteCategoriaById) 

//para pel router poder usar en otro archivo .json o modulo
module.exports=router;