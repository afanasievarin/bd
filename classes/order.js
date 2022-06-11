const pool = require('../init.js');

async function getCartItemsByOrderID(orderID){
    let items = await pool.execute(`
        SELECT * FROM items
        LEFT JOIN categories 
        ON items.categoryID = categories.categoryID
        LEFT JOIN itemstatuses 
        ON items.itemstatusID = itemstatuses.itemstatusID
        LEFT JOIN itemconditions 
        ON items.itemconditionID = itemconditions.itemconditionID
        INNER JOIN ordertoitems
        ON items.itemID = ordertoitems.itemID
        WHERE ordertoitems.orderID = "${orderID}"
    `)
    .catch(err =>{
        console.log(err);
    });
    return items[0];
  };

module.exports = {getCartItemsByOrderID};