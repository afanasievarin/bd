const express = require("express");
const router = express.Router();
const {getItems, getItemByID} = require("../classes/catalog.js");

router.get("/catalog", async function(_,response){
    var items = await getItems();
    response.render("catalog.hbs", {items: items});
    //console.log(items);
  });

router.get("/itempage/:id", async function(request,response){
    var id = request.params.id;
    var item = await getItemByID(id);
    response.render("itempage.hbs", {item: item[0]});
    console.log(item);
  });

module.exports = router;