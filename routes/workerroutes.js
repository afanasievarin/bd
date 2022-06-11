const express = require("express");
const router = express.Router();
const {getWorkerByID, updateWorkerByID, getWorkers, createWorker} = require("../classes/worker.js");
const {verifyToken, checkIfAdmin, checkIfWorker} = require("../classes/login.js");
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

router.get("/workers",verifyToken,checkIfAdmin, async function(request,response){
    var workers = await getWorkers();
    response.render("workers/workers.hbs", {workers: workers,token: request.fakeToken});
});

router.get("/workers/worker/:id",verifyToken,checkIfAdmin, async function(request,response){
    var worker = await getWorkerByID(request.params.id);
    response.render("workers/worker.hbs", {worker: worker[0],token: request.fakeToken});
});

router.get("/worker",verifyToken,checkIfWorker, async function(request,response){
    var worker = await getWorkerByID(request.fakeToken.id);
    response.render("workers/worker.hbs", {worker: worker[0],token: request.fakeToken, attribute:"readonly"});
});

router.get("/worker/create",verifyToken,checkIfAdmin, async function(request,response){
    const create = "True";
    response.render("workers/worker.hbs", {token: request.fakeToken, checkCreate: create});
});

router.post("/workers/worker/update", jsonParser, async function(request,response){
  if(!request.body || !await updateWorkerByID(request.body)) response.sendStatus(400);
  else response.sendStatus(200);
});

router.post("/workers/worker/create", jsonParser, async function(request,response){
    if(!request.body || !await createWorker(request.body)) response.sendStatus(400);
    else response.sendStatus(200);
  });

module.exports = router;