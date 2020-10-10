// Requiero de Express para crear un Router 
const express = require('express');
const router = express.Router();

// Controladores
const loginCtrl = require('../controllers/login');
const signupCtrl = require('../controllers/signup');
const authTokenAdmin = require('../middlewares/authTokenAdmin');
const authTokenUser = require('../middlewares/authTokenUser');
const usuario = require('../controllers/usuario');


//**----- RUTAS ----- **/

//***  Ingreso ***/
router.route('/login').post(loginCtrl.login);

//***  Registro ***/
router.route('/signup').post(signupCtrl.signUp);

//***  Admin ***/
router.route('/admin').post(authTokenAdmin.ingreso,authTokenAdmin.isAdmin);


//*** Users ***/

//Autenticacion de usuario
router.route('/user').post(authTokenUser.ingreso);

//Obtener todos los productos en stock
router.route('/user/productos').get(usuario.productos);

//Enviar pedido seleccionado
router.route('/user/carrito').put(usuario.carrito);

//Obtener estado de nuestro pedido
router.route('/user/:id').get(usuario.estado);



//---Platos
router.route('/platos').get((req,res)=> res.status(200).send("aqui los platos"));


module.exports = router;