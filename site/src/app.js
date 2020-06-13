const express = require("express");
const app = express();

// Requerimientos de rutas
const homeRouter = require('./routes/home');
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');

const methodOverride = require('method-override');
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '../public'))); // Para los recursos estaticos de public
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.listen(3000, function(){
    console.log("Running on 3000");
});

// Rutas
app.use('/', homeRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);