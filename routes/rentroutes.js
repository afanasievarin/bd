const express = require("express");
const router = express.Router();
const {getRentableItems, getItemByID} = require("../classes/rent.js");

router.get("/rent", async function(_,response){
    var rentableitems = await getRentableItems();
    response.render("catalog/rent.hbs", {items: rentableitems});
    //console.log(items);
});

router.get("/rentitempage/:id", async function(request,response){
  var id = request.params.id;
  var item = await getItemByID(id);
  response.render("catalog/rentitempage.hbs", {item: item[0]});
  console.log(item);
});

module.exports = router;