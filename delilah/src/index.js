const express = require('express');
const app = express();
const port = 5000;
const router = require('./router/routes');
const sequelize = require('./configs/sequelize');
const middlewares = require('./middlewares/middGlobales');
const response = require('./global/response');


//**Middlewares */
middlewares(app);

//**Rutas */
app.use('/',router);



//MIDLEWARE DE MANEJO DE ERRORES
app.use((req, res)=>{

    respuesta = new response(true, 404, "URL not found GG");
    res.status(404).send(respuesta);
});
app.use((err, req, res, next) => {

    if (!err) { //no hay error
        return next();
    }
    console.log(JSON.stringify(err));

    res.status(500).send("An unexpected error has ocurred GG"+err);
});

//PUERTO ESCUCHANDO
app.listen(port, ()=>{
    console.log(`Listen to port ${port}`);
});

/* source D:/Users/Ger/Desktop/ProyectoDelilah/Delilah/delilah/src/db/creacion.sql;
ADMIN
{
"user" : "German11",
"fullName" : "German Saracca",
"email": "german11@gmail.com",
"telefono" : "2494334455",
"direccion" : "Alsina 90",
"pass" : "German11"
}

USUARIOS
{
    "user" : "German22",
    "fullName" : "German Dosdos",
    "email": "german22@gmail.com",
    "telefono" : "2494678901",
    "direccion" : "Mitre 333",
    "pass" : "German22"

}
{
    "user" : "Fabian33",
    "fullName" : "Fabian Trestres",
    "email": "fabian33@gmail.com",
    "telefono" : "2494252565",
    "direccion" : "Alsina 608",
    "pass" : "Fabian33"

}
{
    "user" : "Lucas44",
    "fullName" : "Lucas Cuatro",
    "email": "lucas44@gmail.com",
    "telefono" : "2494449099",
    "direccion" : "Rodriguez 333",
    "pass" : "Lucas 44"
}
{
    "user" : "LeoMessi10",
    "fullName" : "Lionel Messi",
    "email": "messi10@gmail.com",
    "telefono" : "2494335566",
    "direccion" : "Av.España 174",
    "pass" : "LeoMessi10"
}
*/