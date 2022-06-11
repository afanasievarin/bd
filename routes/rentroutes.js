const express = require("express");
const router = express.Router();
const {getRentableItems, getItemByID,getContractItemsByContractID,submitContract,deleteContractItem, getContractsByUserToken} = require("../classes/rent.js");
const {findEmptyContract} = require("../classes/catalog.js");
const {verifyToken, checkIfAdmin, checkIfWorker} = require("../classes/login.js");
var bodyParser = require('body-parser');
const { request } = require("express");
var jsonParser = bodyParser.json();

router.get("/rent",verifyToken, async function(request,response){
    var rentableitems = await getRentableItems();
    response.render("catalog/rent.hbs", {items: rentableitems,token:request.fakeToken});
});

router.get("/rentitempage/:id",verifyToken, async function(request,response){
  var id = request.params.id;
  var item = await getItemByID(id);
  response.render("catalog/rentitempage.hbs", {item: item[0],token:request.fakeToken});
});

router.get("/shopcart/contract",verifyToken, async function(request,response){
  var contract = await findEmptyContract(request.fakeToken.id);
  var items;
  var id = "";
  if(contract[0])
  {
    items = await getContractItemsByContractID(contract[0].contractID);
    id = contract[0].contractID;
  }
  else items = {};
  response.render("orders/shopcart.hbs", {items: items,ID:id, type: "contract", token: request.fakeToken});
});

router.post("/shopcart/create/contract",jsonParser, async function(request,response){
  if(!request.body || !await submitContract(request.body)) response.sendStatus(400);
  else response.sendStatus(200);
});

router.post("/shopcart/delete/contract",jsonParser, async function(request,response){
  if(!request.body || !await deleteContractItem(request.body)) response.sendStatus(400);
  else response.sendStatus(200);
});

router.get("/contracts",verifyToken,checkIfWorker, async function(request,response){
    var contracts = await getContractsByUserToken(request.fakeToken);
    response.render("contracts/contracts.hbs",{contracts: contracts,token: request.fakeToken})
});

module.exports = router;