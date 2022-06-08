const pool = require('../init.js');

async function getUserByID(ID){
    let user = await pool.execute(`
        SELECT * FROM users
        WHERE users.userID = "${ID}"
        LIMIT 1
    `)
    .catch(err =>{
        console.log(err);
    });
    //console.log(items[0]);
    return user[0];
}

module.exports = {getUserByID};