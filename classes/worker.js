const pool = require('../init.js');
const bcrypt = require("bcrypt");

const saltRounds = 10;

async function getWorkers(){
    let workers = await pool.execute(`
        SELECT * 
        FROM workers
    `)
    .catch(err =>{
        console.log(err);
    });
    return workers[0];
}

async function getWorkerByID(ID){
    let worker = await pool.execute(`
        SELECT * 
        FROM workers
        WHERE workerID = "${ID}"
        LIMIT 1
    `)
    .catch(err =>{
        console.log(err);
    });
    return worker[0];
}
async function updateWorkerByID(data){
    var result;
    var date = data.passportdate;
    if(!data.passportdate || data.passportdate == "") date="0000-00-00";
    await pool.execute(`
        UPDATE workers
        SET 
        workersurname = "${data.surname}",
        workername = "${data.name}",
        workermidname = "${data.midname}",
        workeremail = "${data.email}",
        workerphone = "${data.phone}",
        workerpassport ="${data.passport}",
        workerpassportby = "${data.passportby}",
        workerpassportdate = "${date}",
        workersalary = "${data.salary}",
        workerexperience = "${data.experience}"
        WHERE workerID = "${data.ID}"
    `)
    .then(()=>{
        result =true;
    })
    .catch(err=>{
        console.log(err);
        result = false;
    });
    return result;
}

async function createWorker(data){
    var result;
    const psw = bcrypt.hashSync(data.password, saltRounds);
    await pool.execute(`
  INSERT workers(workersurname, workername, workermidname, workerlogin, workerpassword,
     workeremail, workerphone, workerpassport, workerpassportby, workerpassportdate, workersalary, workerexperience)
  VALUES ("${data.surname}", "${data.name}", "${data.midname}", 
  "${data.login}", "${psw}", "${data.email}","${data.phone}",  
  "${data.passport}", "${data.passportby}", "${data.passportdate}",
  "${data.salary}", "${data.experience}")
`)
.then(()=>{
    result =true;
})
.catch(err=>{
    console.log(err);
    result = false;
});
console.log(result);
return result;
}

module.exports = {getWorkerByID,getWorkers,updateWorkerByID,createWorker};