// MODELO DE RESPUESTA --let resp = new Response(err,stat,msj);--
const response = require('../global/response');
const validateInfo = require('./validateInfo');
const jwtSign = require('../global/envs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sequelize = require('../configs/sequelize');


class signupController{

    signUp(req,res,next){

        const {user,fullName, email, telefono,direccion, pass} = req.body;

        // Hash de password
        const hash = bcrypt.hashSync(pass, 10);


        const infoUser = {
            user : user,
            fullName : fullName,
            email : email,
            telefono : telefono,
            direccion : direccion,
            pass : hash
        };
        console.log("infouser: "+ JSON.stringify(infoUser));


        // Verifico que todos los campos ingresados sean sintacticamente validos.
        if(allFieldsOk(user,email,pass,fullName,telefono)){

            // Busco si existe un usuario igual o 
            sequelize.query(`SELECT username FROM usuario WHERE username = ? `, { replacements: [user],
                type: sequelize.QueryTypes.SELECT })

            .then(data => {

                console.log("data"+JSON.stringify(data));

                if(data != '' && user == data[0].username){

                    let resp = new response(true,400,'Username already in use');
                    res.send(resp);
                    return;

                //Si el que se registra contiene este nombre se le da privilego de Admin
                //Esto se haria previo a sacar la app a produccion para que nadie pueda registrarse con ese nombre
                } else if (user === 'German11'){
                    
                    //Si no existe creo y envio el token
                    const accesToken = jwt.sign(infoUser,jwtSign);
                    let resp = new response(false,202,"Token creado",accesToken);

                    res.send(resp);
                    console.log('Token creado');

                    sequelize.query(`INSERT INTO usuario 
                    (username,fullname,email,telefono,direccion,pass,privilegio) VALUES (?,?,?,?,?,?,?) `, 
                    {
                        replacements: [user,fullName, email, telefono,direccion, hash,'A'],//Admin
                        type: sequelize.QueryTypes.INSERT
                    })
                    .then(insercion => {
            
                        console.log(insercion);
                    })
                    .catch(err =>{
                        console.log('Fallo insert de usuario '+err);
                    });

                // Si no el que ingresa es un usuario normal.    
                }else{

                    //Si no existe creo y envio el token
                    const accesToken = jwt.sign(infoUser,jwtSign);
                    let resp = new response(false,202,"Token creado",accesToken);

                    res.send(resp);
                    console.log('Token creado');

                    sequelize.query(`INSERT INTO usuario 
                    (username,fullname,email,telefono,direccion,pass,privilegio) VALUES (?,?,?,?,?,?,?) `, 
                    {
                        replacements: [user,fullName, email, telefono,direccion, hash,'U'],
                        type: sequelize.QueryTypes.INSERT
                    })
                    .then(insercion => {
            
                        console.log(insercion);
                    })
                    .catch(err =>{
                        console.log('Fallo insert de usuario '+err);
                    });

                };

            })
            .catch(err =>{
                console.log('Fallo busqueda de usuario '+err);
            });
        }else{
            res.status(400).send("Datos invalidos");
        }
    };
};

function allFieldsOk(user,email,pass,fullName,telefono){

    if(validateInfo.validateUsernameEmail(user) &&validateInfo.validateUsernameEmail(email) &&
       validateInfo.validatePass(pass) && validateInfo.validateFullName(fullName) 
        && validateInfo.validatePhone(telefono)){

            return true;
        }else{

            return false;
        }

};

module.exports = new signupController();