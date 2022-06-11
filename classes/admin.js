const pool = require("../init.js");
const bcrypt = require("bcrypt");
const saltRounds = 10;

async function getAdmins(){
    var data = await pool.execute(`
    SELECT *
    FROM admins
    `)
    .catch(err=>{
        console.log(err);
    });
    return data[0];
}

async function deleteAdminForID(id){
    var result;
    await pool.execute(`
        DELETE 
        FROM admins
        WHERE adminID = "${id}"
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

async function createAdmin(data){
    var result;
    const psw = bcrypt.hashSync(data.password, saltRounds);
    await pool.execute(`
        INSERT admins(adminlogin, adminemail, adminpassword)
        VALUES ("${data.login}","${data.email}","${psw}")
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

module.exports = {deleteAdminForID,getAdmins,createAdmin}