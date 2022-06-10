const express = require("express");
const router = express.Router();
const {getOrderItemsByUserID} = require("../classes/order.js");
const {getItems} = require("../classes/catalog.js");

router.get("/shopcart", async function(request,response){
    var items = await getItems();
    response.render("orders/shopcart.hbs", {items: items});
});

module.exports = router;