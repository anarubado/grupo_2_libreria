const jsonModel = require('../models/jsonModel');
const usersModel = jsonModel('users.json');
const path = require('path');
const { body } = require("express-validator");
const bcryptjs = require("bcryptjs");

const validator = {

    register: [

        body("user")

          .notEmpty()
          .withMessage("*Este Campo es obligatorio")
          .bail()
          .isLength({ min: 3 })
          .withMessage("*El usuario debe tener como mínimo 3 caracteres")
          .bail()
          .custom((value) => {
            let user = usersModel.findBySomething((user) => user.user == value);  // Valida si el nombre de usuario ya existe 
            return !user;
          })
          .withMessage("*El usuario ya está registrado"),                 

        body("email")
          .notEmpty()
          .withMessage("*Este campo es obligatorio")
          .bail()
          .isEmail()
          .withMessage("*El campo debe ser un email")
          .bail()
          .custom((value) => {
            let user = usersModel.findBySomething((user) => user.email == value);
    
            return !user;
          })
          .withMessage("Email ya registrado"),

        body("image")

          .custom(function(value, {req}){
            if (req.file){

              let acceptedExt = ['.jpg', '.png', '.jepg'];
              let ext = path.extname(req.file.originalname);

              return acceptedExt.includes(ext);

            }
            return true;
            
          })
          .withMessage("Extensión inválida"), 
    
           
        body("password")
          .notEmpty()
          .withMessage("*Este Campo es obligatorio")
          .bail()
          .isLength({ min: 8 })
          .withMessage("La contraseña debe tener como mínimo 8 caracteres"),
        
        body("retype")
          .notEmpty()
          .withMessage("*Este Campo es obligatorio")
          .bail()
          .custom((value, {req}) => {
            return value == req.body.password;

          })
          .withMessage("*Las contraseñas no coinciden")
    ],


    login: [
        body ('email')
          .notEmpty()
          .withMessage("*Este Campo es obligatorio")
          .bail()
          .custom((value, {req}) => {
            let user = usersModel.findBySomething((user) => user.email == value);
        
            if (user){
                let validation = bcryptjs.compareSync(req.body.password, user.password);
                return validation;
            }
            return false;
          })
          .withMessage("Email o contraseña inválida"),

        body("password")
          .notEmpty()
          .withMessage("El campo es obligatorio")
      ]

}

module.exports = validator;