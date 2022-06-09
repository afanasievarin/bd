const pool = require("./init.js");
const hbs = require('hbs');
const {createTables} = require("./create_tables.js");
const catalogroutes = require("./routes/catalogroutes.js");
const orderroutes = require("./routes/orderroutes.js");
const userroutes = require("./routes/userroutes.js");
const rentroutes = require("./routes/rentroutes.js");

const express = require("express");
createTables();
const app = express();
hbs.registerPartials('views/partials');
app.use(express.static('public'));
app.use(catalogroutes);
app.use(orderroutes);
app.use(userroutes);
app.use(rentroutes);
app.set("view engine", "hbs");
app.get("/",function(_,response){
  response.render("main.hbs")
});
app.get("/aboutus",function(_,response){
  response.render("aboutus.hbs")
}); 
app.get("/lk",function(_,response){
  response.render("lk.hbs")
}); 
app.get("/privatedata",function(_,response){
  response.render("privatedata.hbs")
}); 
app.get("/signin",function(_,response){
  response.render("signin.hbs")
});
app.get("/signup",function(_,response){
  response.render("signup.hbs")
});
//ЙОу собаки я наруто узумаки

app.listen(3000);
