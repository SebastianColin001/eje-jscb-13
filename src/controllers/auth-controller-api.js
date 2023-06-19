const { request } = require('express');
const {miConexion}=require('../database/db');
const bcrypt=require('bcrypt')

const authAPI={}; 



authAPI.login=async(req=request,res,next)=>{
    try {
        const{usuario, clave}=req.body; 

        if (usuario==undefined||clave==undefined) {
            res.status(400).json({
                estado:0,
                mensaje:"Faltan parámetros: ususario y/o clave"
            })
            
        } else {
            const conexion=await miConexion(); 
            const resultado=await conexion.query('SELECT * FROM usuarios WHERE usuario=?',[usuario])
            if (resultado.length>0) {
                //si lo encontramos corroboramos clave 
                //necesitamos desencriptar la clave 
                if (await bcrypt.compare(clave,resultado[0].clave)) {
                    //crear las variables de sesion 
                    req.session.usuario=usuario; 
                    req.session.id=resultado[0].id; 
                    res.status(201).json({
                        estado:1,
                        mensaje: "Acceso concedido"
                    })
                } else {
                    res.status(404).json({
                        estado:0,
                        mensaje:"Usuario y/o clave incorrecta"
                    })
                    
                }
                
            } else {
                res.status(404).json({
                    estado:0,
                    mensaje: "Acceso NO concedido"
                })
            }
            
        }

    } catch (error) {
        next(error)
    }
}
authAPI.logout= async (req=request,res,next)=>{

}

module.exports=authAPI; 