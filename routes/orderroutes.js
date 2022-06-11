const express = require("express");
const router = express.Router();
const {getCartItemsByOrderID,submitOrder,deleteOrderItem,getOrdersByUserToken,getOrderByID, getOrderStatusesWithout,updateOrder} = require("../classes/order.js");
const {findEmptyOrder,findEmptyContract} = require("../classes/catalog.js");
const {verifyToken, checkIfAdmin, checkIfWorker} = require("../classes/login.js");
const {getWorkersWithout} = require("../classes/worker.js");
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

router.get("/shopcart/order",verifyToken, async function(request,response){
    var order = await findEmptyOrder(request.fakeToken.id);
    var items;
    var id = "";
    if(order[0])
       {
         items = await getCartItemsByOrderID(order[0].orderID);
         id = order[0].orderID;
       }
    else items = {};
    response.render("orders/shopcart.hbs", {items: items,ID:id, type: "order", token: request.fakeToken});
});

router.post("/shopcart/create/order",jsonParser, async function(request,response){
    if(!request.body || !await submitOrder(request.body)) response.sendStatus(400);
    else response.sendStatus(200);
});

router.post("/shopcart/delete/order",jsonParser, async function(request,response){
    if(!request.body || !await deleteOrderItem(request.body)) response.sendStatus(400);
    else response.sendStatus(200);
});

router.get("/orders",verifyToken, async function(request,response){
    var orders = await getOrdersByUserToken(request.fakeToken);
    response.render("orders/orders.hbs",{orders: orders,token: request.fakeToken})
});

router.get("/orders/order/:id",verifyToken, async function(request,response){
    var data = await getOrderByID(request.params.id);
    var workers = await getWorkersWithout(data.order.workerID);
    var statuses = await getOrderStatusesWithout(data.order.orderstatusID)
    var attribute = "";
    if(request.fakeToken.role == 0) attribute = "readonly disabled";
    response.render("orders/orderinfo.hbs",{order:data.order,workers:workers, orderstatuses:statuses ,items: data.items,attribute:attribute, token: request.fakeToken})
});

router.post("/order/update", jsonParser, async function(request,response){
    if(!request.body || !await updateOrder(request.body)) response.sendStatus(400);
    else response.sendStatus(200);
});

module.exports = router;