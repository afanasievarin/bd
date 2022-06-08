const pool = require('../init.js');

/*async function getContractItemsByID(ID){
    let contractitemsbyid = await pool.execute(`
        SELECT * FROM contractitems
        WHERE users.userID = "${ID}"
        LIMIT 1
    `)
    .catch(err =>{
        console.log(err);
    });
    //console.log(items[0]);
    return user[0];
}*/
async function getRentableItems(){
    let rentableitems = await pool.execute(`
        SELECT * FROM items
        INNER JOIN categories 
        ON items.categoryID = categories.categoryID
        INNER JOIN itemstatuses 
        ON items.itemstatusID = itemstatuses.itemstatusID
        INNER JOIN itemconditions 
        ON items.itemconditionID = itemconditions.itemconditionID
        WHERE items.isrentable = 1
    `)
    .catch(err =>{
        console.log(err);
    });
    //console.log(items[0]);
    return rentableitems[0];
};

async function getItemByID(ID){
    let item = await pool.execute(`
        SELECT * FROM items
        INNER JOIN categories 
        ON items.categoryID = categories.categoryID
        INNER JOIN itemstatuses 
        ON items.itemstatusID = itemstatuses.itemstatusID
        INNER JOIN itemconditions 
        ON items.itemconditionID = itemconditions.itemconditionID
        WHERE items.itemID = "${ID}"
        LIMIT 1
    `)
    .catch(err =>{
        console.log(err);
    });
    //console.log(items[0]);
    return item[0];
}

module.exports = {getRentableItems, getItemByID};