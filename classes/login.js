const pool = require('../init.js');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const saltRounds = 10;
const key = "ght4hgl95gjydv";
var fakeToken;

async function createUser(data){
    var result;
    const psw = bcrypt.hashSync(data.password, saltRounds);
    if(data.role == 2)
        await pool.execute(`
        INSERT admins(adminemail, adminlogin, adminpassword)
        VALUE ("${data.email}","${data.login}","${psw}")
        `)
        .then(()=>{
            result=true;
        })
        .catch((err)=>{
            console.log(err);
            result = false;
        })
    else
        await pool.execute(`
        INSERT users(useremail, userlogin, userpassword)
        VALUE ("${data.email}","${data.login}","${psw}")
        `)
        .then(()=>{
            result=true;
        })
        .catch((err)=>{
            console.log(err);
            result = false;
        })
    return result;
}


async function findUser(req,res,next){
    var user = {
        login: req.body.login,
        password: req.body.password
    }
    var found;
    if(found = await searchAdmins(user))
    {
        req.user = found;
        next();
    }
    else if(found = await searchWorkers(user))
    {
        req.user = found;
        next();
    }
    else if(found = await searchUsers(user))
    {
        req.user = found;
        next();
    }
    else{
        res.sendStatus(400);
    }
}

function compareAsync(param1, param2) {
    return new Promise(function(resolve, reject) {
        bcrypt.compare(param1, param2, function(err, res) {
            if (err) {
                 reject(err);
            } else {
                 resolve(res);
            }
        });
    });
}

async function searchAdmins(user){
    var data = await pool.execute(`
    SELECT * 
    FROM admins
    WHERE adminlogin = "${user.login}" 
    LIMIT 1
    `)
    .catch((err)=>{
        console.log(err);
    })
    console.log(data[0]);
    if(data[0][0] && await compareAsync(user.password, data[0][0].adminpassword))
    {
        var temp = {
            role:"2",
            id: data[0][0].adminID,
            login: data[0][0].adminlogin
        }
        fakeToken = temp;
        return temp;
    }
    else return false;
}
async function searchWorkers(user){
    var data = await pool.execute(`
    SELECT * 
    FROM workers
    WHERE workerlogin = "${user.login}" 
    LIMIT 1
    `)
    .catch((err)=>{
        console.log(err);
    })
    console.log(data[0]);
    if(data[0][0] && await compareAsync(user.password, data[0][0].workerpassword))
    {
        var temp = {
            role:"1",
            id: data[0][0].workerID,
            login: data[0][0].workerlogin
        }
        fakeToken = temp;
        return temp;
    }
    else return false;
}
async function searchUsers(user){
    var data = await pool.execute(`
    SELECT * 
    FROM users
    WHERE userlogin = "${user.login}" 
    LIMIT 1
    `)
    .catch((err)=>{
        console.log(err);
    })
    console.log(data[0]);
    if(data[0][0] && await compareAsync(user.password, data[0][0].userpassword))
    {
        var temp = {
            role:"0",
            id: data[0][0].userID,
            login: data[0][0].userlogin
        }
        fakeToken = temp;
        return temp;
    }
    else return false;
}

async function genToken(user){
    const token = jwt.sign({ role: user.role, login: user.login, id: user.id },key,{ expiresIn: "24h"});
    return token;
}

async function verifyToken(req,res,next){
    //const token = req.headers['token'];
    if(!fakeToken)
    {
        res.redirect("/signin");
    }
    else
    {
        //req.user = jwt.verify(token,key);
        req.fakeToken = fakeToken;
        next();
    }
}

async function checkIfWorker(req,res,next){
    //if(req.user.role >0) next();
    if(fakeToken.role >0) next();
    else res.redirect("/");
}

async function checkIfAdmin(req,res,next){
    //if(req.user.role >1) next();
    if(fakeToken.role >1) next();
    else res.redirect("/");
}

async function checkIfNoAdmins(req,res,next){
    var admins = await pool.execute(`
        SELECT *
        FROM admins
    `)
    .catch((err)=>{
        console.log(err);
    });
    if(!admins[0][0]) req.body.role = 2;
    next();
}

module.exports = {createUser, findUser, genToken, verifyToken, checkIfAdmin, checkIfWorker, checkIfNoAdmins};