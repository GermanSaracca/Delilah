const cors = require('cors');
const expressjwt = require('express-jwt');
const helmet = require('helmet');
const rateLimit = require("express-rate-limit");
const token = require('../global/envs');
const express = require('express');

//Luego se cambiara, ahora lo dejo asi para poder hacer pruebas.
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 100, // maximo 100 request
    message: "Se supero el limite de requests/hora"
});

//Export los midd globales como funcion anonima
module.exports = function(app){

    //Para que Express comprenda formatos JSON
    app.use(express.json());
    //Habilita CORS de manera global
    app.use(cors());
    //Proteje nuestra app seteando distintos HTTP Headers
    app.use(helmet());
    // Limito a 400 requests por hora
    app.use(limiter);
    //uso tokens en todas las rutas excepto login y signup
    app.use(expressjwt({ secret: token, algorithms: ["HS256"] })
    .unless({path: ['/login', "/signup", "/"]}));

};