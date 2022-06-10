const pool = require('../init.js');

async function getUserByID(ID){
    let user = await pool.execute(`
        SELECT * 
        FROM users
        WHERE userID = "${ID}"
        LIMIT 1
    `)
    .catch(err =>{
        console.log(err);
    });
    //console.log(items[0]);
    console.log(user[0]);
    return user[0];
}
async function updateUserForID(data){
    var result;
    var date = data.passportdate;
    if(!data.passportdate || data.passportdate == "") date="0000-00-00";
    await pool.execute(`
        UPDATE users
        SET 
        usersurname = "${data.surname}",
        username = "${data.name}",
        usermidname = "${data.midname}",
        useremail = "${data.email}",
        userphone = "${data.phone}",
        userpassport ="${data.passport}",
        userpassportby = "${data.passportby}",
        userpassportdate = "${date}"
        WHERE userID = "${data.ID}"
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
module.exports = {getUserByID,updateUserForID};