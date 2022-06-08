const express = require("express");
const router = express.Router();
const {getUserByID} = require("../classes/user.js");

router.get("/privatedata/:id", async function(request,response){
    var id = request.params.id;
    var user = await getUserByID(id);
    response.render("privatedata.hbs", {user: user[0]});
    console.log(user);
  });

module.exports = router;