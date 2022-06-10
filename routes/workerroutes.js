const express = require("express");
const router = express.Router();
const {getUserByID, updateUserForID} = require("../classes/user.js");
const {verifyToken, checkIfAdmin, checkIfWorker} = require("../classes/login.js");
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

router.get("/workers",verifyToken, async function(request,response){
    var workers = await getWorkers();
    response.render("workers/workers.hbs", {workers: workers});
    console.log(user);
});

router.get("/worker",verifyToken, async function(request,response){
    var user = await getWorkerByID(request.fakeToken.id);
    response.render("workers/worker.hbs", {user: user[0]});
    console.log(user);
});

router.post("/workers/worker/update", jsonParser, async function(request,response){
  if(!request.body || !await updateWorkerForID(request.body)) response.sendStatus(400);
  else response.sendStatus(200);
});

module.exports = router;