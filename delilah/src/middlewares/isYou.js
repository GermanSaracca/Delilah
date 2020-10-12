
// Midlleware que comprueba a traves del token, si quien quiere realizar la accion sobre
// cierto pedido es dueño de ese pedido.
const sequelize = require('../configs/sequelize');
const response = require('../global/response');
const jwtSign = require('../global/envs');
const jwt = require('jsonwebtoken');

//Esto es un middleware que chequea que quien quiera modificar o eliminar un pedido sea el dueño del pedido.
module.exports = function isYou(req,res,next){

    const token = req.headers.authorization.split(' ')[1];
    //Descifro el token para encontrar que usuario quiere eliminar y si su pedido le corresponde
    const verificarToken = jwt.verify(token,jwtSign);
    //Usuario 
    let user = verificarToken.user;
    //Pedido ingresado
    let idPedido = req.params.id; 

    sequelize.query(`SELECT id_usuario FROM pedido WHERE id_pedido = ?`,
    { replacements : [idPedido], type: sequelize.QueryTypes.SELECT })
    .then(data =>{

        let id_usuario = data[0].id_usuario;

        sequelize.query(`SELECT username FROM usuario WHERE id_usuario = ?`,
        { replacements : [id_usuario], type: sequelize.QueryTypes.SELECT })
        .then(data2 =>{

            let username = data2[0].username;

            console.log("El q envia: "+username);
            console.log("El del pedido:"+user);

            if(username == user){

                next();
            }else{
                let respuesta = new response(true,400,"Usted no puede eliminar este pedido ya que no le pertenece");
                res.send(respuesta);
            }
        })
    })
};

