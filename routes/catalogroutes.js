const express = require("express");
const router = express.Router();
const {getItems, getItemByID,getItemsUpdateData,createItem,updateItem,deleteParameterForID,editParameters,addItemToCartByID} = require("../classes/catalog.js");
const {verifyToken, checkIfAdmin, checkIfWorker} = require("../classes/login.js");
var bodyParser = require('body-parser');
const { json } = require("express");
var jsonParser = bodyParser.json();

router.get("/catalog", async function(_,response){
    var items = await getItems();
    response.render("catalog/catalog.hbs", {items: items});
  });

router.get("/itempage/:id", async function(request,response){
    var id = request.params.id;
    var item = await getItemByID(id);
    response.render("catalog/itempage.hbs", {item: item[0]});
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

router.get("/items/parameters", async function(request,response){
  var data = await getItemsUpdateData();
  response.render("catalog/parameters.hbs",{categories: data.categories,itemstatuses: data.itemstatuses,itemconditions: data.itemconditions})
});

router.post("/items/parameters/delete/:id",jsonParser,async function(request,response){
  if(!request.body || !await deleteParameterForID(request.body.name,request.params.id)) response.sendStatus(400);
  else response.sendStatus(200);
});

router.post("/items/parameters/edit",jsonParser, async function(request,response){
  console.log(request.body);
  if(!request.body || ! await editParameters(request.body)) response.sendStatus(400);
  else response.sendStatus(200);
});

router.post("/catalog/addtocart", jsonParser,verifyToken, async function(request,response){
  if(!request.body || ! await addItemToCartByID(request.body.ID, request.fakeToken.id)) response.sendStatus(400);
  else response.sendStatus(200);
});

module.exports = router;