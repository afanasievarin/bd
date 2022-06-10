const pool = require("./init.js");
const hbs = require('hbs');
const {createTables} = require("./create_tables.js");
const catalogroutes = require("./routes/catalogroutes.js");
const orderroutes = require("./routes/orderroutes.js");
const userroutes = require("./routes/userroutes.js");
const rentroutes = require("./routes/rentroutes.js");
const lkroutes = require("./routes/lkroutes.js");
const loginroutes = require("./routes/loginroutes.js");
const workerRoutes = require("./routes/workerroutes.js");


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
app.use(loginroutes);
app.use(workerRoutes);


hbs.registerHelper('isGreater', function(p, q, options) {
    return (parseInt(p) > parseInt(q)) ? options.fn(this) : options.inverse(this);
  });

  hbs.registerHelper('isLesser', function(p, q, options) {
    return (parseInt(p) < parseInt(q)) ? options.fn(this) : options.inverse(this);
  });
  hbs.registerHelper('isEquals', function(p, q, options) {
    return (p == q) ? options.fn(this) : options.inverse(this);
  });

app.set("view engine", "hbs");

//ЙОу собаки я наруто узумаки

app.listen(3000);
