
var mongoose=require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/Booking');

const express=require('express');
const app=express();

app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));


const http=require('http').Server(app);

const user_route=require('./Routes/userRoutes');

app.use('/',user_route);

http.listen(3000,()=>{
    console.log("Server running in 3000");
})