const sequelize = require('../../configs/sequelize');
const login = require('../../controllers/login');

/*
    Este modula exporta cuatro funciones/querys
        -Buscar los ID de todos los pedidos.
        -Buscar la informacion completa de cada uno de los pedidos
        -Buscar detalle de solo productos del pedido por separado con su valor unitario
        -Buscar info completa de usuario perteneciente al pedido.
        
*/ 
module.exports = {

    findIdsPedidos : async function(){


        let find = await sequelize.query(`SELECT id_pedido FROM pedido WHERE estado <> 'ENTREG'`,
        { type: sequelize.QueryTypes.SELECT });

        let result = await find;

        let arrayIdPedidos = await result;

        return arrayIdPedidos;
    } ,

    findIdsPedidosEntregados : async function(){


        let find = await sequelize.query(`SELECT id_pedido FROM pedido WHERE estado = 'ENTREG'`,
        { type: sequelize.QueryTypes.SELECT });

        let result = await find;

        let arrayIdPedidosEntreg = await result;

        return arrayIdPedidosEntreg;
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

    } ,

    detalleProdsPedido : async function(id){

        let find3 = await sequelize.query(`SELECT
            prod.nombre_producto,
            prod.valor as valor_unitario,
            det.cantidad,
            (det.cantidad * prod.valor) as total,
            prod.imagen
        FROM
            pedido as ped
            JOIN usuario as us ON(ped.id_usuario = us.id_usuario)
            JOIN pedido_detalle as det ON(ped.id_pedido = det.id_pedido)
            JOIN producto as prod ON(det.id_producto = prod.id_producto)
        WHERE
            ped.id_pedido = ?`,
        { replacements : [id], type: sequelize.QueryTypes.SELECT});

        let result3= await find3;

        let detalleProds = await result3;

        return detalleProds;

    } ,

    infoUsuarioPedido : async function(id){

        let find4 = await sequelize.query(`SELECT DISTINCT
            ped.estado,
            ped.formapago,
            us.direccion,
            us.fullname,
            us.username,
            us.telefono,
            us.email
        FROM
            pedido as ped
            JOIN usuario as us ON(ped.id_usuario = us.id_usuario)
            JOIN pedido_detalle as det ON(ped.id_pedido = det.id_pedido)
            JOIN producto as prod ON(det.id_producto = prod.id_producto)
        WHERE
            ped.id_pedido = ?`,
        { replacements : [id], type: sequelize.QueryTypes.SELECT});

        let result4= await find4;

        let infoUsuario = await result4;

        return infoUsuario;

    } ,

};