const jsonModel = require('../models/jsonModel');
const productsModel = jsonModel('products.json');
let db = require ('../database/models');
let sequelize = db.sequelize

const { validationResult } = require("express-validator");

const productsController = {
    
    category: function(req, res){

        let category = db.Categories.findByPk(req.params.id, {include: {all: true, nested: true}});
        let subCategories = db.SubCategories.findAll({
            where: {
                categoryId: req.params.id
            }
        })
        let news =  db.Products.findAll(
            {   include:{all:true},
                where: {
                    categoryId: req.params.id    
                },
                order: [['createdAt', 'DESC']],
                limit:6
            }
            );
        let discounts = db.Products.findAll({
            include:{all:true},
            where: {
                categoryId: req.params.id    
            },
            order: [["discount", "DESC"]],
            limit: 6
        });

        
        
        Promise.all([category, subCategories, news, discounts])
            .then(function([category, subCategories, news, discounts]){
                return res.render('category', {products: category.products, category: category, subCategories: subCategories, news: news, discounts: discounts});
            })
    },

    subcategory: function(req,res){

    },

    detail: function(req, res){
        let virginiaWoolf = db.Products.findAll({ 
            include:{ all: true }, 
            where: { authorId: 9}
        });
        let jkRowling = db.Products.findAll({ 
            include:{ all: true }, 
            where: { authorId: 10}
        });

        let detail = db.Products.findByPk(req.params.idProduct, {
            include: {
                all: true
            }
        })

        Promise.all([virginiaWoolf, jkRowling, detail])
        .then(function([virginiaWoolf, jkRowling, detail]){
            return res.render('detail', {virginiaWoolf, jkRowling, detail: detail});       

        })  
    }, 

    edit: function(req, res){
        let product = db.Products.findByPk(req.params.idProduct, {include: {
              all: true
            }})
        let categories = db.Categories.findAll()
        let subCategories = db.SubCategories.findAll()
        let authors = db.Authors.findAll()
        let editorials = db.Editorials.findAll()
        let coverTypes = db.CoverTypes.findAll()
        let formatTypes = db.FormatTypes.findAll()
        
      
        Promise.all([product, categories, subCategories, authors, editorials, coverTypes, formatTypes])
            .then(function([product, categories, subCategories, authors, editorials, coverTypes, formatTypes]){
                return res.render('admin/products/edit',{product, categories, subCategories, authors, editorials, coverTypes, formatTypes})
            })
            
    },

    update: function(req,res) {
        db.Products.update ({
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            stock: req.body.stock,
            isbn: req.body.isbn,
            numberPages: req.body.numberPages,
            //image: req.file ? req.file.filename : 'default-image.jpg',
            authorId: req.body.author,
            categoryId: req.body.category,
            subCategoryId: req.body.subCategory,
            editorialId: req.body.editorial,
            coverTypeId: req.body.coverType,
            formatTypeId: req.body.formatType
        }, {
            where: {
                id: req.params.idProduct
            }
        });
        /*db.Authors.update ({
            name: req.body.name,
            lastName: req.body.lastName
        },{
            where: {
                id:req.params.idProduct
            }
        });*/
        return res.redirect('/');
        
        
    },

    delete: function(req, res){
        db.Products.destroy({
            where:{
                id: req.params.idProduct
            }
        })
        .then(function(){
            return res.redirect('/products/list');

        })
        
    },

    create: function(req,res){
        let authors = db.Authors.findAll();
        let categories = db.Categories.findAll();
        let subCategories = db.SubCategories.findAll();
        let editorials = db.Editorials.findAll();
        let coverTypes = db.CoverTypes.findAll();
        let formatTypes = db.FormatTypes.findAll();

        Promise.all([authors, categories, subCategories, editorials, coverTypes, formatTypes])
            .then(function([authors, categories, subCategories, editorials, coverTypes,formatTypes]){
                return res.render('admin/products/create', {authors, categories, subCategories, editorials, coverTypes, formatTypes});
            })
    },

    save: function(req, res){
        let errors = validationResult(req);

        if(errors.isEmpty()){
            db.Products.create({
                title: req.body.title,
                description: req.body.description,
                price: req.body.price,
                stock: req.body.stock,
                isbn: req.body.isbn,
                numberPages: req.body.numberPages,
                image: req.file ? req.file.filename : 'default-image.jpg',
                authorId: req.body.author,
                categoryId: req.body.category,
                subCategoryId: req.body.subCategory,
                editorialId: req.body.editorial,
                coverTypeId: req.body.coverType,
                formatTypeId: req.body.formatType
            })
            .then(function(){
                return res.redirect('/products/list');

            })
    
            

        } else{
            let authors = db.Authors.findAll();
            let categories = db.Categories.findAll();
            let subCategories = db.SubCategories.findAll();
            let editorials = db.Editorials.findAll();
            let coverTypes = db.CoverTypes.findAll();
            let formatTypes = db.FormatTypes.findAll();

            Promise.all([authors, categories, subCategories, editorials, coverTypes, formatTypes])
                .then(function([authors, categories, subCategories, editorials, coverTypes,formatTypes]){
                    return res.render('admin/products/create',{authors, categories, subCategories, editorials, coverTypes, formatTypes, errors: errors.mapped(), old: req.body});
                });
        }

        

        
    },

    list: function(req, res){
        db.Products.findAll({
            include: {
                all: true
            }
        })
        .then(function(products){
            let details = products.map(product => {
                return ({
                    id: product.id,
                    title: product.title,
                    author: product.author.name + " " + product.author.lastName
                })               
            });
            return res.render('admin/products/list', {details: details});            

        })
            
    }
}

module.exports = productsController;