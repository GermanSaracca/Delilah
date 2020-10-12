const sequelize = require('../../configs/sequelize');
const login = require('../../controllers/login');

/*
    Este modula exporta dos funciones
        -Buscar los ID de todos los pedidos.
        -Buscar la informacion completa de cada uno de los pedidos
        

*/ 
module.exports = {

    findIdsPedidos : async function(){


        let find = await sequelize.query(`SELECT id_pedido FROM pedido WHERE estado <> 'ENTREGADO'`,
        { type: sequelize.QueryTypes.SELECT });

        let result = await find;

        let arrayIdPedidos = await result;

        return arrayIdPedidos;
    } ,

    infoPedidos : async function(ids){

        let find2 = await sequelize.query(`SELECT
        ped.estado,
        ped.fecha,
        ped.id_pedido,
        GROUP_CONCAT(CONCAT(prod.nombre_producto, ' x ', det.cantidad)) as descripcion,
        SUM((det.cantidad * prod.valor)) as total,
        ped.formapago,
        us.fullname,
        us.username,
        us.direccion,
        us.telefono
    FROM
        pedido as ped
        JOIN usuario as us ON(ped.id_usuario = us.id_usuario)
        JOIN pedido_detalle as det ON(ped.id_pedido = det.id_pedido)
        JOIN producto as prod ON(det.id_producto = prod.id_producto)
    WHERE
        ped.id_pedido = ? `,
        { replacements: [ids] ,type: sequelize.QueryTypes.SELECT });

        let result2 = await find2;

        let dataFinal = await result2;

        return dataFinal;

    }

};