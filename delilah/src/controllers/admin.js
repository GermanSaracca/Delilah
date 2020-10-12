const response = require('../global/response');
const querysAdmin = require('../database/models/querysAdmin');


class Admin{

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


};

module.exports = new Admin();