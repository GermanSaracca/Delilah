const response = require('../global/response');
const sequelize = require('../configs/sequelize');
var moment = require('moment');
const jwtSign = require('../global/envs');
const jwt = require('jsonwebtoken');

const querysUsuario = require('../database/models/querysUsuario');


class Usuario{

    //Obtener todo el Menu
    productos(req,res){

        sequelize.query(`SELECT id_producto,nombre_producto,valor,imagen FROM producto WHERE en_stock = 'T';`,{ type: sequelize.QueryTypes.SELECT })
        .then(productos =>{

            console.log(productos);
            let resp =  new response(false,200,"Productos",productos)
            res.send(resp);
        })
        .catch(err=>{
            console.log(err);
            let resp =  new response(true,400,"Error al buscar todos los productos")
            res.send(resp);
        });
    };

    //Enviar pedido 
    async enviarPedido(req,res){

        // Inicializo la transaccion y la guardo en una variable
        const t = await sequelize.transaction();

        try{

            const token = req.headers.authorization.split(' ')[1];

            //Descifro el token para encontrar que usuario envio el pedido
            const verificarToken = jwt.verify(token,jwtSign);
            //Usuario 
            let user = verificarToken.user;
    
    
            //Obtengo el ID del usuario por su nombre de usuario enz
            let userId = await querysUsuario.findIdByUser(user,t);
    
            //La forma de pago viene dentro del body
            let formaPago = req.body[0].formaPago;
            
            //Insercion del pedido en BASE DE DATOS
            let IdPedido = await querysUsuario.insertPedido(userId,formaPago,t);
    
    
            //Inserto en la tabla pedido_detalle el id de cada prod con su cantidad
            //Posicion 1 ya que en posicion 0 tenemos la forma de pago
            let bodyLength = req.body.length;
    
            for(let i=1; i<bodyLength; i++){
    
                let id_prod = req.body[i].id_producto;
                let cantidad = req.body[i].cantidad;

                await querysUsuario.insertDetallePedido(IdPedido,id_prod,cantidad,t);
    
            };

            // Si se llego hasta aca es que no cachamos ningun error, se commitea la transaccion
            await t.commit();
            //Envio el id de pedido generado
            let resp =  new response(false,200,"Id de pedido",IdPedido);
            res.send(resp);

        }catch (error){
        
        // Si cachamos algun error en las querys se hace rollback 
        await t.rollback();

        let resp =  new response(true,400,"Informacion invalida");
        res.send(resp);
        };

            
    };

    //Obtener estado de pedido
    estado(req,res){

        let idPedido = req.params.id;

        sequelize.query(`SELECT estado FROM pedido WHERE id_pedido = ?;`,{ replacements:[idPedido] ,type: sequelize.QueryTypes.SELECT })
        .then(estado=>{

            if(estado == ''){

                let resp =  new response(true,400,"Numero de pedido no valido");
                res.send(resp);
            }else{

                let resp =  new response(false,200,"Estado de pedido",estado);
                res.send(resp);
            }

        })
        .catch(err =>{
            
            console.log(err);
            let resp =  new response(true,400,"Informacion invalida");
            res.send(resp);
        })
    };

    //Esto funcionara como un middleware para eliminar el pedido enviado 
    //y luego se instanciara nuevamente el metodo "enviarPedido" para crear un nuevo pedido
    modificarPedido(req,res,next){

        let idPedido = req.params.id; 
        
        //Busco fecha y hora exacta en que se realizo el pedido que se quiere modificar
        sequelize.query(`SELECT fecha FROM pedido WHERE id_pedido = ?`,{ replacements:[idPedido], type: sequelize.QueryTypes.SELECT })
        .then(fecha =>{
            
            if(fecha != ''){

                //Fecha y hora actual
                let fechaNow = new Date();
                //Fecha en que se concreto el pedido original
                let fechaOriginalPedido = fecha[0].fecha;
                // Comparo las dos fechas y obtengo la diferencia en milisegundos
                let a = moment(fechaNow);
                let b = moment(fechaOriginalPedido);

                let diffMiliseg = a.diff(b);//Diferencia en milisegundos

                let diffMinutos = diffMiliseg/60000;//Paso la diferencia a minutos

                if(diffMinutos > 8){

                    let msg =  `Ya no es posible modificar su pedido ya que lo pidio hace mas de 8 minutos, ${Math.round(diffMinutos)} min para ser exactos ;)`;
                    let resp =  new response(true,418,msg);
                    res.send(resp);
                }else{
                    //Primero elimino el pedido original
                    sequelize.query(`DELETE FROM pedido WHERE id_pedido = ?`,{ replacements:[idPedido], type: sequelize.QueryTypes.DELETE })
                    .then(resp=>{
                        //Lo mando al metodo de crear nuevo pedio
                        next();
                    })
                    .catch(error=>{
                        console.log(error);
                        let resp =  new response(true,400,"Error de servidor");
                        res.send(resp);
                    })
                };

            }else{

                let resp =  new response(true,400,"Numero de pedido no valido");
                res.send(resp); 
            };
        })
        .catch(err=>{
            console.log(err);
            let resp =  new response(true,400,"Error de servidor");
            res.send(resp);
        })
    };

    //Cancelar pedido
    cancelarPedido(req,res){


        let idPedido = req.params.id; 
        
        //Busco fecha y hora exacta en que se realizo el pedido que se quiere eliminar
        sequelize.query(`SELECT fecha FROM pedido WHERE id_pedido = ?`,{ replacements:[idPedido], type: sequelize.QueryTypes.SELECT })
        .then(fecha =>{
            console.log(fecha);
            if(fecha != ''){

                //Fecha y hora actual
                let fechaNow = new Date();
                //Fecha en que se concreto el pedido original
                let fechaOriginalPedido = fecha[0].fecha;
                // Comparo las dos fechas y obtengo la diferencia en milisegundos
                let a = moment(fechaNow);
                let b = moment(fechaOriginalPedido);

                let diffMiliseg = a.diff(b);//Diferencia en milisegundos

                let diffMinutos = diffMiliseg/60000;//Paso la diferencia a minutos

                if(diffMinutos > 10){

                    let msg =  `Ya no es posible cancelar su pedido ya que lo pidio hace mas de 10 minutos, ${Math.round(diffMinutos)} min para ser exactos ;)`;
                    let resp =  new response(true,418,msg);
                    res.send(resp);
                }else{
                    //Cancelo el pedido 
                    sequelize.query(`UPDATE pedido SET estado = 'CANC' WHERE id_pedido = ?`,
                    { replacements : [ idPedido ], type: sequelize.QueryTypes.UPDATE})
                    .then(update =>{
                        
                        // Si el segundo valor de la respuesta del update es 0 quiere decir que
                        // no se pudo modificar nada ya q no existe el nro de id
                        if(update[1] === 0){
            
                            let respuesta = new response(true,400,`El pedido nro ${idPedido} no existe`);
                            res.send(respuesta);
            
                        }else {
            
                            let respuesta = new response(false,200,`Pedido nro ${idPedido} cancelado`);
                            res.send(respuesta);
                        }
                    })
                    .catch(err => {
            
                        console.log(err);
                        let respuesta = new response(true,400,"No se pudo cancelar pedido");
                        res.send(respuesta);
                    })
                };

            }else{

                let resp =  new response(true,400,"Numero de pedido no valido");
                res.send(resp); 
            };
        })
        .catch(err=>{
            console.log(err);
            let resp =  new response(true,400,"Error de servidor");
            res.send(resp);
        })
    };

    //Obtiene los 3 platos mas pedidos por el usuario
    async obtenerFavoritos(req,res){

        let username = req.params.username;
        
        let favoritos = await querysUsuario.obtenerFavoritos(username);

        let resp = new response(false,200,"Favoritos",favoritos);
        res.send(resp);
    }
};

module.exports = new Usuario();