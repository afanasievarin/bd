const express = require("express");
const router = express.Router();
const {getRentableItems} = require("../classes/rent.js");

router.get("/rent", async function(_,response){
    var rentableitems = await getRentableItems();
    response.render("rent.hbs", {items: rentableitems});
    //console.log(items);
  });

module.exports = router;