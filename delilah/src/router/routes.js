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



//***  ADMIN ***/______________________________________________________

//Autenticacion de administrador
router.route('/admin').post(authTokenAdmin.ingreso,authTokenAdmin.isAdmin);

//Ruta para obtener todos los pedidos actuales del dia
router.route('/admin/orders').get(admin.obtenerPedidos);

//Obtener el detalle de un pedido en particular
router.route('/admin/orders/detalle/:id').get(admin.detallePedido);

//Modificar estado de un pedido
router.route('/admin/orders/modificarEstado/:id').put(admin.modificarEstadoPedido);

//Cancelar un pedido
router.route('/admin/orders/cancelarPedido/:id').put(admin.cancelarPedido);

//Cargar nuevo producto
router.route('/admin/cargarProducto').post(admin.cargarProducto);

//Historial de ventas (pedidos entregados)
router.route('/admin/orders/historial').get(admin.historialPedidos);

//______________________________________________________________________

//*** USUARIOS ***/_____________________________________________________

//Autenticacion de usuario
router.route('/user').post(authTokenUser.ingreso);

//Obtener todos los productos en stock
router.route('/user/productos').get(usuario.productos);

//Enviar pedido seleccionado
router.route('/user/enviar').post(usuario.enviarPedido);

//Obtener estado de nuestro pedido
router.route('/user/estado/:id').get(usuario.estado);

//Modificar un pedido ya realizado (solo se puede modificar antes de los 8 minutos de pedido)
router.route('/user/modificar/:id').put(isYou,usuario.modificarPedido,usuario.enviarPedido);

//Cancelar un pedido ya realizado (solo se puede cancelar antes de los 5 minutos de pedido)
router.route('/user/cancelar/:id').put(isYou,usuario.cancelarPedido);

//Obtener los 3 mas favoritos (3 productos mas veces pedidos)
router.route('/user/favoritos/:username').get(usuario.obtenerFavoritos);

//______________________________________________________________________





module.exports = router;