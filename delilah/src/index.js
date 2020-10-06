const express = require('express');
const app = express();
const port = 5000;
const router = require('./router/routes');
const sequelize = require('./configs/sequelize');
const middlewares = require('./middlewares/middGlobales');


//**Middlewares */
middlewares(app);

//**Rutas */
app.use('/',router);



//MIDLEWARE DE MANEJO DE ERRORES
app.use((req, res)=>{

    respuesta = new Response(true, 404, "URL not found GG");
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