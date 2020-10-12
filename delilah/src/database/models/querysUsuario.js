const sequelize = require('../../configs/sequelize');

/*
    Este modula exporta tres funciones
        -Buscar ID por nombre de usuario.
        -Insertar pedido.
        -Insertar detalles de pedido.
        -Obtener los 3 platos mas pedidos por el usuario
*/ 


module.exports = {

    findIdByUser: async function(user,t){

        //Busco id de usuario segun su nombre de usuario
        let data =  await sequelize.query(`SELECT id_usuario FROM usuario WHERE username = ? `,
        { replacements : [user], type: sequelize.QueryTypes.SELECT, transaction: t });
        
        let infoId = await data;

        let id = await infoId[0].id_usuario;
        
        return id;
    },

    insertPedido: async function(userId,formaPago,t){
        
        //Insertar pedido de usuario
        let data = await sequelize.query(`INSERT INTO pedido (id_usuario,formapago,estado) VALUES
        (?,?,'Nuevo')`,{ replacements: [userId,formaPago], type: sequelize.QueryTypes.INSERT, transaction: t  });

        let data2 = await data;

        let idPedido= await data2[0];
        
        return idPedido;
    },

    insertDetallePedido:  async function(IdPedido,id_prod,cantidad,t){

        await sequelize.query(`INSERT INTO pedido_detalle (id_pedido,id_producto,cantidad) VALUES
        (?,?,?);`,{ replacements: [ IdPedido,id_prod,cantidad ], type: sequelize.QueryTypes.INSERT, transaction: t });

    },

    obtenerFavoritos : async function(username){

        let favs = await sequelize.query(`SELECT 
                count(*) AS veces_pedida,
                prod.nombre_producto,
                prod.valor,
                prod.id_producto
            FROM
                pedido as ped
                JOIN usuario as us ON(ped.id_usuario = us.id_usuario)
                JOIN pedido_detalle as det ON(ped.id_pedido = det.id_pedido)
                JOIN producto as prod ON(det.id_producto = prod.id_producto)
            WHERE
                us.username = ? AND ped.estado = 'ENTREG'
            GROUP BY prod.nombre_producto 
            ORDER BY veces_pedida DESC
            LIMIT 3`,
        {replacements : [username],type: sequelize.QueryTypes.SELECT});

            let favoritos = await favs;
            return favoritos;
    }

};

