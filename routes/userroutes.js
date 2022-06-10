const express = require("express");
const router = express.Router();
const {getUserByID} = require("../classes/user.js");

router.get("/privatedata", async function(request,response){
    var user = await getUserByID(request.user.id);
    response.render("homepage/privatedata.hbs", {user: user[0]});
    console.log(user);
  });

module.exports = router;