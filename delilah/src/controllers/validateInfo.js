
// Esta clase contiene metodos para validar todos los tipos de datos
// ingresados para loguearse o registrarse

class validateInfo {

    validateUsernameEmail(param){
        

        // Minimo 8 caracteres, al menos una letra mayuscula, una letra minuscula y un numero.
        const usernameReqs= /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,36}$/;
        // un @ que separe y un '.[algo]' al final
        const emailReqs = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        
        //validacion nombre de usuario
        if(usernameReqs.test(param) || emailReqs.test(param)){
    
            return true;
        }else {
    
            return false;
        }
    }

    validateOnlyEmail(param){

        // un @ que separe y un '.[algo]' al final
        const emailReqs = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        
        //validacion nombre de usuario
        if(emailReqs.test(param)){
    
            return true;
        }else {
    
            return false;
        }
    }

    validateFullName (param){

        // Permite espaciados en el nombre, cada nombre o apellido debe arrancar con mayuscula.
        const fullNameReqs = /^[A-Z][a-zA-Z]{3,}(?: [A-Z][a-zA-Z]*){0,2}$/;

        // Validación de nombre completo de usuario.
        if(fullNameReqs.test(param)){
            return true;
        }else {
            return false;
        }
    }
    
    validatePhone(param){

        // Permite espaciados en el numero
        const phoneReqs = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;

        // Validación de telefono de usuario.
        if(phoneReqs.test(param)){
            return true;
        }else {
            return false;
        }
    }

    validatePass(param){


        // Minimo 8 caracteres, al menos una letra mayuscula, una letra minuscula y un numero.
        const passReqs= /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,36}$/;

        //validacion nombre de usuario
        if(passReqs.test(param)){

            return true;
        }else {
    
            return false;
        }
    }


};

module.exports = new validateInfo();






