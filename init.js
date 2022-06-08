const mysql = require("mysql2");

const pool = mysql.createConnection({
    //connectionLimit: 5,
    host: "localhost",
    user: "root",
    database: "AnimeBD",
    password: "ForeverYoungAndSmile",
    dateStrings: true
  }).promise();

module.exports = pool;
