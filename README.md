# Delilah Restó

Backend para un sistema de pedidos online para un restaurante poniendo en funcionamiento las partes necesarias para montar una REST API,
que permita realizar operaciones CRUD sobre una estructura de datos.

PASOS PARA INSTALACION Y PRUEBA DE API

1- En VSCode posicionarse en la carpeta "delilah" .

2- Abrir la consola de VSCode y tipear : "npm install" para instalar todas las dependencias necesarias.

3- Dentro de la carpeta 'src' crear un archivo .env con la siguiente informacion dentro:  SECRET_TOKEN=G3RM4N

4- Instalar XAMPP. Ir a la carpeta llamada 'xampp' en  disco C: => luego a carpeta 'mysql' =>  luego a carpeta 'bin'.
Dentro de 'bin', clickear la barra de direcciones y escribir "cmd" para abrir la consola de Windows.

5- Activar MySQL desde la consola de XAMPP.

6- Dentro de la consola de Windows tipear : mysql -u root

7- Luego ingresar las siguientes lineas por separado. 
   Una corresponde a la crecion de las tablas y la otra a la insercion de productos.
  CREACION DE TABLAS => 'source D:/Users/Ger/Desktop/ProyectoDelilah/Delilah/delilah/src/database/creacion.sql;'
  INSERCION DE DATOS => 'source D:/Users/Ger/Desktop/ProyectoDelilah/Delilah/delilah/src/database/insercion.sql;'
  
8-Dentro de la consola de Windows tipear 'use delilah;'

9- Dentro de la consola de VSCode posicionarse dentro de la carpeta 'src' y tipear 'nodemon index'
   Deberia entonces mostrar lo siguiente en la consola :
      Listen to port 5000
      warning: please use IANA standard timezone format ('Etc/GMT0')
      warning: please use IANA standard timezone format ('Etc/GMT0')
      Executing (default): SELECT 1+1 AS result
      Connection with DATABASE has been established successfully.

