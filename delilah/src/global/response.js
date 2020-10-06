class Response{

    constructor(err , cod, msj, token) {
        this.error = err;
        this.codigo = cod;
        this.mensaje = msj;
        this.token = token;
    }

};

module.exports = Response;