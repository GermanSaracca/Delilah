const response = require('../global/response');
const querysAdmin = require('../database/models/querysAdmin');
const sequelize = require('../configs/sequelize');


class Admin{

    //Obtener informacion de todos los pedidos que aun no han sido entregados
    async obtenerPedidos(req,res){

        try{
            //Busco los ID de todos los pedidos.
            let listaIdsPedido = await querysAdmin.findIdsPedidos();

            let arrayIds = [];
            //Guardo en un array solo los numeros de los pedidos.
            for(let i = 0; i < listaIdsPedido.length; i++){
    
                arrayIds.push(listaIdsPedido[i].id_pedido);
            };
    

            let arrayPedidos = [];
            //Guardo en un nuevo array la informacion de cada uno de los pedidos
            for(let h = 0; h < arrayIds.length; h++){

                let pedido = await querysAdmin.infoPedidos(arrayIds[h]);

                arrayPedidos.push(pedido);
            }
            
            //Envio cada uno de los pedidos con toda su informacion
            let resp = new response(false,200,"Lista de pedidos", arrayPedidos);
    
            res.send(resp);
               
        }catch(error){

            let resp = new response(false,200,"Error de servidor");
            res.send(resp);
        }
    };

    //Obtener detalle de un pedido en particular
    async detallePedido(req,res){

        let idPedido = req.params.id;

        try{

            let detalleProds = await querysAdmin.detalleProdsPedido(idPedido);

            let infoUsuario = await querysAdmin.infoUsuarioPedido(idPedido);

            let detail = { detalleProductos : detalleProds };
            let infoUser = { infoUsuario: infoUsuario };

            let info = [];

            info.push(detail);
            info.push(infoUser);

            let respuesta = new response(false,200,"Detalle pedido e informacion completa de usuario", info);
            res.send(respuesta);

        }catch(error){

            console.error();

            let respuesta = new response(true,400,"Fallo busqueda detalle de pedido");
            res.send(respuesta);

        }
    };

    //Modificar el estado de un pedido
    modificarEstadoPedido(req,res){

        let idPedido = req.params.id;

        let nuevoEstado = req.body[0].estado;

        sequelize.query(`UPDATE pedido SET estado = ? WHERE id_pedido = ?`,
        { replacements : [ nuevoEstado, idPedido ], type: sequelize.QueryTypes.UPDATE})
        .then(update =>{
            
            // Si el segundo valor de la respuesta del update es 0 quiere decir que
            // no se pudo modificar nada ya q no existe el nro de id
            if(update[1] === 0){

                let respuesta = new response(true,400,`El pedido nro ${idPedido} no existe`);
                res.send(respuesta);

            }else {

                let respuesta = new response(false,200,`Pedido nro ${idPedido} modificado`);
                res.send(respuesta);
            }
        })
        .catch(err => {

            console.log(err);
            let respuesta = new response(true,400,"No se pudo modificar pedido");
            res.send(respuesta);
        })
    };

    //Cancelar un pedido
    cancelarPedido(req,res){

        let idPedido = req.params.id;

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

    cargarProducto(req,res){

        let nombreProd = req.body[0].nombreProd;
        let valorProd = req.body[0].valorProd;
        let imgProd = req.body[0].imgProd;
        let enStock = req.body[0].enStock;

        sequelize.query(`INSERT INTO producto
        (nombre_producto,valor,imagen,en_stock) VALUES
        (?,?,?,?)`,{replacements:[nombreProd,valorProd,imgProd,enStock], type: sequelize.QueryTypes.INSERT})
        .then(data=>{

            let totalDeProds = data[0];
            let resp =  new response(false,200,`${nombreProd} agregado a la lista de productos`);
            res.send(resp);
            console.log(data);
        })
        .catch(err=>{

            let resp =  new response(true,400,`${nombreProd} no se pudo agregar`);
            res.send(resp);
            console.log(err);
        })
    };

    eliminarProducto(req,res){

        let idProducto = req.params.id_producto;

        sequelize.query(`DELETE FROM producto WHERE id_producto = ?`,
        {replacements : [idProducto]})
        .then(deleted =>{

            let rowsEliminadas = deleted[0].affectedRows;

            if(rowsEliminadas === 0){

                let resp = new response(true,400,`El id: ${idProducto} no corresponde a un producto o ya fue eliminado`);
                res.send(resp);
            }else{

                let resp = new response(false,200,`Producto ${idProducto} eliminado`);
                res.send(resp);

            }
            
        })
        .catch(err=> console.log(err));

    };

    eliminarPedido(req,res){

        let idPedido = req.params.id; 

        sequelize.query(`DELETE FROM pedido WHERE id_pedido = ?`,
        { replacements : [ idPedido ]})
        .then(deleted =>{

            let rowsEliminadas = deleted[0].affectedRows;
            if(rowsEliminadas === 0){

                let resp = new response(true,400,`El pedido: ${idPedido} no existe`);
                res.send(resp);
            }else{

                let resp = new response(false,200,`Pedido ${idPedido} eliminado`);
                res.send(resp);

            };
        })
        .catch(err => {

            console.log(err);
            let resp = new response(false,200,`Error de servidor`);
            res.send(resp);

        });

    };

    async historialPedidos(req,res){

        //Busco los ID de todos los pedidos entregados
        let listaIdsPedido = await querysAdmin.findIdsPedidosEntregados();
        let arrayIds = [];
        //Guardo en un array solo los numeros de los pedidos.
        for(let i = 0; i < listaIdsPedido.length; i++){

            arrayIds.push(listaIdsPedido[i].id_pedido);
        };

        let pedidosEntregados = [];

        let lengthIds = listaIdsPedido.length;

        for(let j = 0; j < lengthIds; j++ ){

            let pedido = await querysAdmin.infoPedidos(arrayIds[j]);

            pedidosEntregados.push(pedido);

        };

        let respuesta = new response(false,200,"Historial de pedidos entregados",pedidosEntregados);
        res.send(respuesta);

    };

};

module.exports = new Admin();