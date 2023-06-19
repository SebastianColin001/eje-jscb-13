// Requerimos la conexion a la base de datos 
const { request } = require('express');
const {miConexion}=require('../database/db');
const { json } = require('body-parser');

// objeto para manejar el CRUD de categoria 
const categoriasAPI ={};

//el objeto categoriasAPI =C , R (una o todas), U , D
//C=POST R=GET U=PUT D=DELETE
// aqui vamos a eliminar  vamos a eliminar una categoria
categoriasAPI.deleteCategoriaById=async(req=request,res,next)=>{
    try {
        const{ id }=req.params; 
        const conexion = await miConexion(); 
        const resultado =await conexion.query('DELETE FROM categorias WHERE id =?',[id]);
        if (resultado[0].affectedRows>0) {
            res.status(200).json ({
                estado:1,
                mensaje:"Categorias aliminada"
            })
            
        } else {
            res.status(404).json({
                estado:0,
                mensaje:"Categorias aliminada"
            })

        }



        res.json(resultado); 
    } catch (error) {
        next(error); 
    }
}

//vamos a actualizar la categoria 
categoriasAPI.updateCategoria= async (req=request,res,next)=>{
    try {
        const {descripcion,observaciones}=req.body;
        const {id}=req.params;
        if (id==undefined || descripcion==undefined || observaciones==undefined) {
            res.status(400).json({
                estado:0,
                mensaje: "Solicitud incorrecta: Faltan parámetros"
            }) 
        } else {
            const conexion=await miConexion(); 
            const resultado=await conexion.query('UPDATE categorias SET descripcion=?, observaciones=? WHERE id=?',[descripcion,observaciones,id]);
            if(resultado[0].affectedRows>0){
                res.status(200).json({
                    estado:1,
                    mensaje:"Categoria Actualizada",
                    descripcion:descripcion,
                    observaciones: observaciones
                }); 
            }else{
                res.status(404).json({
                    estado:0,
                    mensaje:"Categoria No Actualizada"
                })
            }
            
            
        }
        
    } catch (error) {
        next(error);
        
    }
}

// agregar categoria 
categoriasAPI.agregarCategoria = async (req=request,res=request,next)=>{
    try {
       const{descripcion, observaciones}= req.body;
       //verificar que la solicitud contenga los dos elementos 
       if(descripcion==undefined || observaciones==undefined){
            res.status(400).json({
                estado:0,
                mensaje:"Solicitud incorrecta: faltan parámetros"
            })
            
       }else{
            const conexion=await miConexion(); 
            const resultado= await conexion.query('Insert INTO categorias(descripcion,observaciones) values (?,?)',[descripcion,observaciones]); 
            res.status(201).json({
                estado:1,
                mensaje: "Categoria agregada exitosamente",
                categoria: {
                    Id: resultado[0].insertId,
                    descripcion: descripcion,
                    observaciones: observaciones
                }
            });
       }
    } catch (error) {
        next (error);
    }
}



//aquí que nos regrese una categoría vía ID
categoriasAPI.getCategoriaById= async (req=request,res,next)=>{
    try {
        //recuperar el id de la categoría 
        const{ id }=req.params; 
        const conexion = await miConexion(); 
        const [rows]=await conexion.query('SELECT * FROM categorias WHERE id=?',[id]);
        if (rows.length>0){
            res.status(200).json({
                estado:1,
                mensaje:"Categoría encontrada",
                categoria:rows[0]
            })

        }else{
            res.status(404).json({
                estado:0,
                mensaje:"Categoría NO encontrada",
                categoria:rows
            })
        }

    } catch (error) {
        next(error); 
        
    }
}


//Aqui es para regresar todas las  categorias
categoriasAPI.getTodas=async(req, res, next)=>{
    try {
        const conexion = await miConexion(); 
        const [rows]= await conexion.query('SELECT * FROM categorias');
        if(rows.length==0){
            res.status(404).json({
                estado:0,
                mensaje:"Registros no encontrados",
                categorias: rows
            });
        }else{
            res.status(200).json({
                estado:1,
                mensaje:"Registros encontrados",
                categorias: rows
            });
        }
    } catch (error) {
        next(error); 
    }
}

//exportar para poder usarlo en otro mudulo 
module.exports =categoriasAPI; 

