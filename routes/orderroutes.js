const express = require("express");
const router = express.Router();
const {getCartItemsByOrderID} = require("../classes/order.js");
const {findEmptyOrder} = require("../classes/catalog.js");
const {verifyToken, checkIfAdmin, checkIfWorker} = require("../classes/login.js");

router.get("/shopcart",verifyToken, async function(request,response){
    var order = await findEmptyOrder(request.fakeToken.id);
    console.log(order);
    var items = await getCartItemsByOrderID(order[0].orderID);
    console.log(items);
    response.render("orders/shopcart.hbs", {items: items});
});

module.exports = router;