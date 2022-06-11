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

  async function submitOrder(data){
    var result;
    await pool.execute(`
        UPDATE orders
        SET
        orderstatusID = "1"
        WHERE orderID = "${data.ID}"
    `)
    .then(()=>{
        result = true;
    })
    .catch((err)=>{
        console.log(err);
        result = false;
    })
    return result;
  }
  async function deleteOrderItem(data){
    var result;
    await pool.execute(`
        DELETE 
        FROM ordertoitems
        WHERE orderID="${data.ID}" AND itemID="${data.itemID}"
        LIMIT 1
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
  async function getOrdersByUserToken(token){
    var orders;
    if(token.role == "2")
        orders = await pool.execute(`
        SELECT *
        FROM orders
        LEFT JOIN users
        ON orders.userID = users.userID
        LEFT JOIN workers
        ON orders.workerID = workers.workerID
        LEFT JOIN orderstatuses
        ON orders.orderstatusID = orderstatuses.orderstatusID
        WHERE orders.orderstatusID is not null
        `)
        .catch((err)=>{
            console.log(err);
        })
    else if(token.role == "1")
        orders = await pool.execute(`
        SELECT *
        FROM orders
        WHERE workerID = "${token.ID}"
        `)
        .catch((err)=>{
            console.log(err);
        })
    else if(token.role == "0")
        orders = await pool.execute(`
        SELECT *
        FROM orders
        WHERE userID = "${token.ID}" AND orderstatusID is not null
        `)
        .catch((err)=>{
            console.log(err);
        })
    return orders[0];
  }
module.exports = {getCartItemsByOrderID,submitOrder,deleteOrderItem,getOrdersByUserToken};