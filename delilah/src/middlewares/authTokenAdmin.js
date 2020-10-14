// MODELO DE RESPUESTA --let resp = new response(err,stat,msj);--
const response= require('../global/response');

const jwtSign = require('../global/envs');
const jwt = require('jsonwebtoken');
const sequelize = require('../configs/sequelize');

class AuthToken{

    ingreso(req,res,next){
        try{

            let username = req.body.user;
            let userpass = req.body.pass;
            
            const token = req.headers.authorization.split(' ')[1];
    
            //verifico el token con la firma secreta y el token enviado por el cliente
            const verificarToken = jwt.verify(token,jwtSign);
    
    
            console.log("--Token decodificado : "+JSON.stringify(verificarToken));
            
            // Comparo si el token decodificado pertenece al usuarioenviado.
            if(username == verificarToken.user){
                
                console.log("--Usuario autenticado");

                next();
            }else{
    
                let respuesta = new response(true,500,"Usuario no autenticado");
                console.log("--Usuario no autenticado");
                res.json(respuesta);
            }
    
    
        }catch(err){
    
            let respuesta = new response(true,500,"Fallo autenticacion");
            res.json(respuesta);
        }
    };
    //Verificar que es admin para ingresar a la pagina inicial
    isAdmin(req,res){

        let username = req.body.user;
        // Busco si el usuario que quiere entrar tiene el privilegio de Administrador ('A')
        sequelize.query(`SELECT privilegio FROM usuario WHERE username = ? `, { replacements: [username],
            type: sequelize.QueryTypes.SELECT })
            .then(privilegio =>{

                console.log(privilegio);
                let privilegioUser = privilegio[0].privilegio;

                if(privilegioUser == 'A'){

                    let respuesta = new response(false,200,"Usuario autenticado");
                    console.log("--Usuario autenticado");
                    res.status(200).json(respuesta);

                }else {

                    let respuesta = new response(false,200,"Usted no posee los privilegios");
                    console.log("--Usuario no administrador");
                    res.status(400).json(respuesta);
                }
            })
        .catch(err =>{console.log(err)});

    };
    //Verificar que es admin para cada ruta de admin
    Admin(req,res,next){

        const token = req.headers.authorization.split(' ')[1];
        //Descifro el token para encontrar que usuario quiere eliminar y si su pedido le corresponde
        const verificarToken = jwt.verify(token,jwtSign);
        //Usuario 
        let username = verificarToken.user;

        sequelize.query(`SELECT privilegio FROM usuario WHERE username = ? `, { replacements: [username],
            type: sequelize.QueryTypes.SELECT })
            .then(privilegio =>{

                console.log(privilegio);
                let privilegioUser = privilegio[0].privilegio;

                if(privilegioUser == 'A'){

                    console.log("--Es Admin, next.");
                    next();

                }else {

                    let respuesta = new response(false,200,"Usted no posee los privilegios");
                    console.log("--No es Admin");
                    res.status(400).json(respuesta);
                }
            })
        .catch(err =>{console.log(err)});
    }

};

module.exports =  new AuthToken();