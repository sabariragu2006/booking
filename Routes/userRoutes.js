const express=require('express');
const user_route=express();

const bodyParser=require('body-parser');

user_route.set('view engine', 'ejs');
user_route.set('views', './views'); // Adjust the path if necessary


const controllers = require('../Controllers/userController');

user_route.get('/signup',controllers.signupLoad);
user_route.post('/signup',controllers.signup);

user_route.get('/', controllers.loginLoad);  // Default home page route after login
user_route.post('/login', controllers.login);  // Login route

user_route.get('/seller',controllers.sellerLoad);
user_route.post('/seller', controllers.seller);

user_route.get('/home', controllers.home);
user_route.get('/ticket/:id', controllers.ticket);




module.exports=user_route;

