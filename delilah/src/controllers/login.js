// MODELO DE RESPUESTA --let resp = new Response(err,stat,msj);--
const response = require('../global/response');
const validateInfo = require('./validateInfo');
const jwtSign = require('../global/envs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sequelize = require('../configs/sequelize');

class loginController{

    async login(req,res,next){

        let {user, pass} = req.body;
        
        const infoUser = {
            user : user,
            pass : pass
        };


        //Por si entra con email, transformamos el email en username
        if(validateInfo.validateOnlyEmail(user)){

            if(await existsEmail(user)){

                //No importa si el usuario se logue con Username o Email, siempre trabajaremos con Username
                let UsEr = await sequelize.query(`SELECT username FROM usuario WHERE email = ?`,
                { replacements : [user], type : sequelize.QueryTypes.SELECT });

                user = await UsEr[0].username;
            }else{

                let resp = new response(true,400,"Email no encontrado");
                res.send(resp);
            };


        }else{

            console.log("Continua, el usuario ingreso con username");
        };

        if(await existsUsername(user)){

            // Verifico que se haya ingresado un usuario/email y contraseña sintacticamente validos.
            if(validateInfo.validateUsernameEmail(user) && validateInfo.validatePass(pass)){

                // Busco la contraseña del usuario ingresado
                sequelize.query(`SELECT pass FROM usuario WHERE username = ? `, { replacements: [user],
                    type: sequelize.QueryTypes.SELECT })
                .then(hashedPass =>{

                    //Chequeo si la contraseña ingresada coincide con la contraseña hasheada en DB
                    if(bcrypt.compareSync(pass, hashedPass[0].pass)){

                        let hashPass = hashedPass[0].pass;

                        console.log("contraseña valida");

                        sequelize.query(`SELECT username,privilegio FROM usuario WHERE username = ? and pass = ?`, { replacements: [user, hashPass],
                            type: sequelize.QueryTypes.SELECT })
                        .then(info=>{

                            if(info == ''){

                                let resp = new response(true,403,'User not found in DataBase');
                                res.send(resp);
                
                            }else{

                                console.log(info);
                                //Si existe creo y envio el token
                                const accesToken = jwt.sign(infoUser,jwtSign);
                                let resp = new response(false,202,"Token creado",accesToken);
        
                                res.send(resp);
                                console.log('Token creado');

                            }
                        })
                        .catch(error =>{
                            
                            console.log(error);
                            res.status(400).send(error);
                        })
                        
                    }else{

                        console.log("contraseña invalida");

                        let resp = new response(true,403,'Contraseña invalida');
                        res.send(resp);
                    }
                })
                .catch(err=>{

                    res.status(400).send();
                    console.log(err)
                })

            }else{
                res.status(400).send("Usuario o contraseña invalida");
            }

        }else {

            let resp = new response(true,400,"Usuario no encontrado");
            res.send(resp);
        };
    };
};

async function existsUsername(user){

    //Busco si existe algun usuario con ese nombre primero
    let search = await sequelize.query(`SELECT username FROM usuario WHERE username = ?`,
    {replacements : [user], type : sequelize.QueryTypes.SELECT});

    let userExists = await search;

    console.log(userExists);

    if(userExists == ''){

    return false;
    }else{

    return true;
    };
};
async function existsEmail(user){

    //Busco si existe algun usuario con ese nombre primero
    let search = await sequelize.query(`SELECT username FROM usuario WHERE email = ?`,
    {replacements : [user], type : sequelize.QueryTypes.SELECT});

    let userExists = await search;

    console.log(userExists);

    if(userExists == ''){

        return false;
    }else{

        return true;
    };
};



module.exports = new loginController();