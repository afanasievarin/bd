const express = require("express");
const router = express.Router();
var bodyParser = require('body-parser');
const { getUserByID } = require("../classes/user");
var jsonParser = bodyParser.json();
const {verifyToken, checkIfAdmin, checkIfWorker} = require("../classes/login.js");

router.get("/",verifyToken,function(request,response){
    response.render("lk/main.hbs", {token: request.fakeToken})
  });

router.get("/aboutus",verifyToken,function(request,response){
    response.render("lk/aboutus.hbs",{token: request.fakeToken})
}); 

router.get("/lk",verifyToken,function(request,response){
    response.render("lk/lk.hbs",{token: request.fakeToken})
}); 



module.exports = router;