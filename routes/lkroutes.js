const express = require("express");
const router = express.Router();
var bodyParser = require('body-parser');
const { getUserByID } = require("../classes/user");
var jsonParser = bodyParser.json();
const {verifyToken, checkIfAdmin, checkIfWorker} = require("../classes/login.js");

router.get("/",verifyToken,function(_,response){
    response.render("lk/main.hbs")
  });

router.get("/aboutus",verifyToken,function(_,response){
    response.render("lk/aboutus.hbs")
}); 

router.get("/lk",verifyToken,function(_,response){
    response.render("lk/lk.hbs")
}); 



module.exports = router;