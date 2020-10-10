const sequelize = require('../../configs/sequelize');

/*
    Este modula importa tres funciones
        -Buscar ID por nombre de usuario.
        -Insertar pedido.
        -Insertar detalles de pedido.
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

    }

};

