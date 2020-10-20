const Sequelize = require("sequelize");
const db_data = require('./db_conection_data');

const sequelize   = new Sequelize( db_data.conf_db_name, db_data.conf_user, db_data.conf_password, { 
    host: db_data.conf_db_host,
    dialect: 'mysql',
    port: db_data.conf_port,
    dialectOptions: {
        multipleStatements: true
    }
});


sequelize.authenticate() //para verificar la conexión con la base de datos
.then(resultado => 
    console.log('Connection with DATABASE has been established successfully.')
)
.catch(error => 
    console.error('Unable to connect to the database:', error)
)

module.exports = sequelize;