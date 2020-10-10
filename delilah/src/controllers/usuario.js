const response = require('../global/response');
const sequelize = require('../configs/sequelize');

const jwtSign = require('../global/envs');
const jwt = require('jsonwebtoken');

const querysUsuario = require('../database/models/querysUsuario');


class Usuario{

    
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

    async carrito(req,res){

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

    estado(req,res){

        let idPedido = req.params.id;

        sequelize.query(`SELECT estado FROM pedido WHERE id_pedido = ?;`,{ replacements:[idPedido] ,type: sequelize.QueryTypes.SELECT })
        .then(estado=>{

            console.log(estado);
            let resp =  new response(false,200,"Estado de pedido",estado);
            res.send(resp);
        })
        .catch(err =>{
            
            console.log(err);
            let resp =  new response(true,400,"Informacion invalida");
            res.send(resp);
        })
    }

};

module.exports = new Usuario();