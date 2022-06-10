const express = require("express");
const router = express.Router();
var bodyParser = require('body-parser');
const {createUser, findUser, genToken, checkIfNoAdmins} = require("../classes/login.js");
var jsonParser = bodyParser.json();

router.get("/signin", function(_,response){
    response.render("login/signin.hbs")
});

router.get("/signup",function(_,response){
    response.render("login/signup.hbs")
});

router.post("/signup",jsonParser, checkIfNoAdmins,function(request,response){
    if(!request.body || !await createUser(request.body)) response.sendStatus(400);
    else response.sendStatus(200);
});

router.post("/signin", jsonParser, findUser, async function(request,response){
    const token = await genToken(request.user);
    response.json({token: token});
});