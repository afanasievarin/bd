const pool = require("./init.js");
const hbs = require('hbs');
const {createTables} = require("./create_tables.js");
const catalogroutes = require("./routes/catalogroutes.js");
const orderroutes = require("./routes/orderroutes.js");
const userroutes = require("./routes/userroutes.js");
const rentroutes = require("./routes/rentroutes.js");
const lkroutes = require("./routes/lkroutes.js");

const express = require("express");
createTables();
const app = express();
hbs.registerPartials('views/partials');
app.use(express.static('public'));
app.use(catalogroutes);
app.use(orderroutes);
app.use(userroutes);
app.use(rentroutes);
app.use(lkroutes);
app.set("view engine", "hbs");

//ЙОу собаки я наруто узумаки

app.listen(3000);
