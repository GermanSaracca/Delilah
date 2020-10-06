
// Esta clase contiene dos metodos 
// Uno para validar username o email , y el otro para validar password.

class validateInfo {

    validateUsernameEmail(param){
        
        var flag = false;
        // Minimo 8 caracteres, al menos una letra mayuscula, una letra minuscula y un numero.
        const usernameReqs= /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,36}$/;
        const emailReqs = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        
        //validacion nombre de usuario
        if(usernameReqs.test(param) || emailReqs.test(param)){
    
            flag = true;
        }else {
    
            flag = false;
        }
        return flag;
    }

    validatePass(param){

        var flag = false;
        // Minimo 8 caracteres, al menos una letra mayuscula, una letra minuscula y un numero.
        const passReqs= /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,36}$/;

        //validacion nombre de usuario
        if(passReqs.test(param)){

            flag = true;
        }else {
    
            flag = false;
        }
        return flag;
    }
};

module.exports = new validateInfo();






