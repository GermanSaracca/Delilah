const Sequelize = require("sequelize");
const sequelize = new Sequelize("mariadb://root@localhost:3306/delilah");


sequelize.authenticate() //para verificar la conexión con la base de datos
.then(resultado => 
    console.log('Connection with DATABASE has been established successfully.')
)
.catch(error => 
    console.error('Unable to connect to the database:', error)
)

module.exports = sequelize;