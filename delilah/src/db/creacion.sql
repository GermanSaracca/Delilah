DROP DATABASE IF EXISTS delilah;
CREATE DATABASE delilah;

USE delilah;

CREATE TABLE usuario (

    id_usuario int(11) AUTO_INCREMENT NOT NULL,
    username varchar(36) NOT NULL,
    fullname varchar(255) NOT NULL,
    email varchar(102) NOT NULL,
    telefono varchar(64) NOT NULL,
    direccion varchar(64) NOT NULL,
    pass varchar(255) NOT NULL,
    privilegio enum('A','U')  NOT NULL,

    PRIMARY KEY (id_usuario)

)ENGINE = InnoDB;

CREATE TABLE producto (
    
    id_producto int(11) AUTO_INCREMENT NOT NULL,
    nombre_producto varchar(36) NOT NULL,
    valor decimal(6,2) NOT NULL,
    imagen varchar(255) NOT NULL,
    en_stock enum('T','F') NOT NULL,

    PRIMARY KEY (id_producto)

)ENGINE = InnoDB;

CREATE TABLE forma_pago (

    id_formapago int(11) AUTO_INCREMENT NOT NULL,
    descripcion enum('Efectivo','Tarjeta') NOT NULL,

    PRIMARY KEY (id_formapago)

)ENGINE = InnoDB;

CREATE TABLE pedido (
    
    id_producto int(11) AUTO_INCREMENT NOT NULL,
    id_usuario int(11)  NOT NULL,
    id_formapago int(11)  NOT NULL,
    fecha timestamp NOT NULL,
    estado enum('NUEVO','CONFIRM','PREP','ENV','CANC','ENTREG') NOT NULL,
    descripcion varchar(36) NOT NULL,

    PRIMARY KEY (id_producto),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_formapago) REFERENCES forma_pago(id_formapago)

)ENGINE = InnoDB;

CREATE TABLE pedido_detalle (

    id_pedido int(11) NOT NULL,
    id_producto int(11) NOT NULL,
    cantidad int(5) NOT NULL,

    PRIMARY KEY (id_pedido,id_producto)

)ENGINE = InnoDB;


