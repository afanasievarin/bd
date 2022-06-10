const express = require("express");
const router = express.Router();
var bodyParser = require('body-parser');
const { getUserByID } = require("../classes/user");
var jsonParser = bodyParser.json();

router.get("/",function(_,response){
    response.render("lk/main.hbs")
  });

router.get("/aboutus",function(_,response){
    response.render("lk/aboutus.hbs")
}); 

router.get("/lk",function(_,response){
    response.render("lk/lk.hbs")
}); 

router.get("/privatedata",function(request,response){
    response.render("lk/privatedata.hbs")
}); 

router.get("/signin",function(_,response){
    response.render("login/signin.hbs")
});

router.get("/signup",function(_,response){
    response.render("login/signup.hbs")
});



module.exports = router;