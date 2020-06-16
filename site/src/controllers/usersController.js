const jsonModel = require('../models/jsonModel');
const usersModel = jsonModel('users');
const fs = require('fs');
const path = require('path');



const usersController = {

    register: function(req, res){
        return res.render("register");
    },

    save: function(req, res){
        let user = {
            id:"",
            ...req.body,
        }

        let usuarios = fs.readFileSync(path.join(__dirname, '..', 'data', 'users.json'),'utf-8');
        usuarios = JSON.parse(usuarios);
        //usuarios.push(user);

        usuarios = [...usuarios, user];

        usuarios = JSON.stringify(usuarios, null, " ");
    
        fs.writeFileSync(path.join(__dirname, '..', 'data', 'users.json'), usuarios);
        
        return res.redirect('/');

    },


    login: function(req, res){
        return res.render("login");
    },

    cart: function(req, res){
        return res.render("cart");
    }
}

module.exports = usersController;