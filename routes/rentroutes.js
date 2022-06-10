const express = require("express");
const router = express.Router();
const {getRentableItems, getItemByID} = require("../classes/rent.js");
const {verifyToken, checkIfAdmin, checkIfWorker} = require("../classes/login.js");

router.get("/rent", async function(_,response){
    var rentableitems = await getRentableItems();
    response.render("catalog/rent.hbs", {items: rentableitems});
});

router.get("/rentitempage/:id", async function(request,response){
  var id = request.params.id;
  var item = await getItemByID(id);
  response.render("catalog/rentitempage.hbs", {item: item[0]});
});

module.exports = router;