const express = require("express");
const router = express.Router();
const {getItems, getItemByID,getItemsUpdateData,createItem,updateItem} = require("../classes/catalog.js");
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

router.get("/catalog", async function(_,response){
    var items = await getItems();
    response.render("catalog/catalog.hbs", {items: items});
    //console.log(items);
  });

router.get("/itempage/:id", async function(request,response){
    var id = request.params.id;
    var item = await getItemByID(id);
    response.render("catalog/itempage.hbs", {item: item[0]});
    console.log(item);
  });

router.get("/items/create", async function(request,response){
    var data = await getItemsUpdateData();
    response.render("catalog/createitem.hbs",{categories: data.categories,itemstatuses: data.itemstatuses,itemconditions: data.itemconditions})
});

router.post("/items/create",jsonParser, async function(request,response){
  if(!request.body || !await createItem(request.body)) response.sendStatus(400);
  else response.sendStatus(200);
});

router.get("/items/update/:id", async function(request,response){
  var item = await getItemByID(request.params.id);
  var data = await getItemsUpdateData();
  var isrent;
  parseInt(item[0].itemisrentable) == 0 ? isrent = "" : isrent="checked";
  response.render("catalog/createitem.hbs",{item:item[0],isrent:isrent,categories: data.categories,itemstatuses: data.itemstatuses,itemconditions: data.itemconditions})
});

router.post("/items/update",jsonParser, async function(request,response){
if(!request.body || !await updateItem(request.body)) response.sendStatus(400);
else response.sendStatus(200);
});

module.exports = router;