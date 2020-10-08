// Requiero de Express para crear un Router 
const express = require('express');
const router = express.Router();

// Controladores
const loginCtrl = require('../controllers/login');
const signupCtrl = require('../controllers/signup');
const authTokenAdmin = require('../middlewares/authTokenAdmin');
const authTokenUser = require('../middlewares/authTokenUser');


//** Rutas **/

// Ingreso
router.route('/login').post(loginCtrl.login);

// Registro  
router.route('/signup').post(signupCtrl.signUp);

// Admin
router.route('/admin').post(authTokenAdmin.ingreso,authTokenAdmin.isAdmin);

// Users
router.route('/user').post(authTokenUser.ingreso);

//Platos
router.route('/platos').get((req,res)=> res.status(200).send("aqui los platos"));


module.exports = router;