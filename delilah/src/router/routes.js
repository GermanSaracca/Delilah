// Requiero de Express para crear un Router 
const express = require('express');
const router = express.Router();

// Controladores
const loginCtrl = require('../controllers/login');
const signupCtrl = require('../controllers/signup');
const usuario = require('../controllers/usuario');
const admin = require('../controllers/admin');

// Middlewares
const authTokenAdmin = require('../middlewares/authTokenAdmin');
const authTokenUser = require('../middlewares/authTokenUser');
const isYou = require('../middlewares/isYou');

//**----- RUTAS ----- **/

//***  Ingreso ***/
router.route('/login').post(loginCtrl.login);

//***  Registro ***/
router.route('/signup').post(signupCtrl.signUp);

//***  ADMIN ***/

//Autenticacion de administrador
router.route('/admin').post(authTokenAdmin.ingreso,authTokenAdmin.isAdmin);

//Ruta para obtener todos los pedidos actuales del dia
router.route('/admin/orders').get(admin.obtenerPedidos);





//*** USUARIOS ***/

//Autenticacion de usuario
router.route('/user').post(authTokenUser.ingreso);

//Obtener todos los productos en stock
router.route('/user/productos').get(usuario.productos);

//Enviar pedido seleccionado
router.route('/user/enviar').post(usuario.enviarPedido);

//Obtener estado de nuestro pedido
router.route('/user/estado/:id').get(usuario.estado);

//Modificar un pedido ya realizado (solo se puede modificar antes de los 5 minutos de pedido)
router.route('/user/modificar/:id').put(isYou,usuario.modificarPedido,usuario.enviarPedido);

//Cancelar un pedido ya realizado (solo se puede cancelar antes de los 5 minutos de pedido)
router.route('/user/cancelar/:id').delete(isYou,usuario.eliminarPedido);






module.exports = router;