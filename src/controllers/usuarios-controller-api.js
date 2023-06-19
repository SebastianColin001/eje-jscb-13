const {miConexion}=require('../database/db');
const bcrypt=require('bcrypt'); 
const { request } = require('express');

const usuariosAPI ={};

usuariosAPI.agregarUsuario=async(req=request,res=request,next)=>{
    try {
        const{usuario,clave,nombre}=req.body; 
        if (usuario==undefined || clave==undefined || nombre==undefined) {
            res.status(400).json({
                estado:0,
                mensaje:"Solicitud incorrecta, faltan parámetros"
            })
        } else {
            const claveEncriptada= await bcrypt.hash(clave,10);
             const conexion=await miConexion(); 
             const resultado=await conexion.query ('INSERT INTO usuarios(usuario,clave,nombre) VALUES (?,?,?)', [usuario,claveEncriptada,nombre]);
             if (resultado[0].affectedRows>0) {
                res.status(200).json({
                    estado:1,
                    mensaje:"Usuario registrado exitosamente",
                    usuario:{
                        id: resultado[0].insertId,
                        usuario: usuario,
                        nombre:nombre
                    }
                })
                
             } else {
                res.status(500).json({
                    estado: 0, 
                    mensaje:"Error interno del servidor"
                })
             }
        }
        
    } catch (error) {
        next(error)
    }
}

module.exports=usuariosAPI; 