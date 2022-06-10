const express = require("express");
const { verifyToken } = require("../classes/login.js");
const router = express.Router();
const {getUserByID, updateUserForID} = require("../classes/user.js");
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

router.get("/user",verifyToken, async function(request,response){
    var user = await getUserByID(request.fakeToken.id);
    response.render("lk/privatedata.hbs", {user: user[0]});
    console.log(user);
});

router.post("/users/user/update", jsonParser, async function(request,response){
  if(!request.body || !await updateUserForID(request.body)) response.sendStatus(400);
  else response.sendStatus(200);
});

module.exports = router;