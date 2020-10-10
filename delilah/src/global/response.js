class Response{

    constructor(err , cod, msj, data) {
        this.error = err;
        this.codigo = cod;
        this.mensaje = msj;
        this.data = data;
    }

};

module.exports = Response;