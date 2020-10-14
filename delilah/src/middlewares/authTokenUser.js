// MODELO DE RESPUESTA --let resp = new response(err,stat,msj);--
const response= require('../global/response');

const jwtSign = require('../global/envs');
const jwt = require('jsonwebtoken');


class AuthTokenUser{

    ingreso(req,res,next){
        try{

            let username = req.body.user;
            
            const token = req.headers.authorization.split(' ')[1];
    
            //verifico el token con la firma secreta y el token enviado por el cliente
            const verificarToken = jwt.verify(token,jwtSign);
    
    
            console.log("--Token decodificado : "+JSON.stringify(verificarToken));
            
            // Comparo si el token decodificado pertenece al usuarioenviado.
            if(username == verificarToken.user){
                
                console.log("--Usuario autenticado");
                let respuesta = new response(false,200,"Usuario autenticado");
                res.status(200).json(respuesta);

            }else{
    
                let respuesta = new response(true,403,"Usuario no autenticado");
                console.log("--Usuario no autenticado");
                res.json(respuesta);
            }
    
    
        }catch(err){
    
            let respuesta = new response(true,500,"Fallo autenticacion");
            res.json(respuesta);
        }
    };

};

module.exports =  new AuthTokenUser();