// MODELO DE RESPUESTA --let resp = new Response(err,stat,msj);--
const response = require('../global/response');
const validateInfo = require('./validateInfo');
const jwtSign = require('../global/envs');
const jwt = require('jsonwebtoken');


class signupController{

    signUp(req,res,next){

        const {user, pass} = req.body;
        const infoUser = {
            user : user,
            pass : pass
        };

        // Verifico que se haya ingresado un usuario/email y contraseña sintacticamente validos.
        if(validateInfo.validateUsernameEmail(user) && validateInfo.validatePass(pass)){

            // Aca va la busqueda en base de datos para ver si existe 

            //Si existe creo y envio el token
            const accesToken = jwt.sign(infoUser,jwtSign);
            let resp = new response(false,202,"Token creado",accesToken);

            res.send(resp);
            console.log('Token creado');

        }else{
            res.status(400).send("Usuario o contraseña invalida");
        }
    }
};

module.exports = new signupController();