const express = require("express");
const router = express.Router();
const {getAdmins,deleteAdminForID,createAdmin} = require("../classes/admin.js");
const {verifyToken, checkIfAdmin, checkIfWorker} = require("../classes/login.js");
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

router.get("/admins",verifyToken,checkIfAdmin,async function(request,response){
    var data = await getAdmins();
    response.render("admins/admins.hbs", {admins: data, token: request.fakeToken});
});

router.get("/admins/admin/create",verifyToken,checkIfAdmin, async function(request,response){
    response.render("admins/create.hbs",{token: request.fakeToken});
});

router.post("/admins/admin/create",jsonParser ,async function(request,response){
    if(!request.body || !await createAdmin(request.body)) response.sendStatus(400);
    else response.sendStatus(200);
});

router.post("/admins/admin/delete/:id", async function(request,response){
    if(!await deleteAdminForID(request.params.id))response.sendStatus(400);
    else response.sendStatus(200);
});

module.exports = router;