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
        LEFT JOIN users
        ON orders.userID = users.userID
        LEFT JOIN workers
        ON orders.workerID = workers.workerID
        LEFT JOIN orderstatuses
        ON orders.orderstatusID = orderstatuses.orderstatusID
        WHERE orders.workerID = "${token.id}" AND orderstatuses.orderstatusID is not null
        `)
        .catch((err)=>{
            console.log(err);
        })
    else if(token.role == "0")
        orders = await pool.execute(`
        SELECT *
        FROM orders
        LEFT JOIN users
        ON orders.userID = users.userID
        LEFT JOIN workers
        ON orders.workerID = workers.workerID
        LEFT JOIN orderstatuses
        ON orders.orderstatusID = orderstatuses.orderstatusID
        WHERE users.userID = "${token.id}" AND orderstatuses.orderstatusID is not null
        `)
        .catch((err)=>{
            console.log(err);
        })
    return orders[0];
  }

  async function getOrderByID(id){
    var order = await pool.execute(`
        SELECT *
        FROM orders
        LEFT JOIN users
        ON orders.userID = users.userID
        LEFT JOIN workers
        ON orders.workerID = workers.workerID
        LEFT JOIN orderstatuses
        ON orders.orderstatusID = orderstatuses.orderstatusID
        WHERE orders.orderID = "${id}"
        LIMIT 1
    `)
    .catch((err)=>{
        console.log(err);
    })
    console.log(id);

    var items = await pool.execute(`
        SELECT * FROM items
        LEFT JOIN categories 
        ON items.categoryID = categories.categoryID
        LEFT JOIN itemstatuses 
        ON items.itemstatusID = itemstatuses.itemstatusID
        LEFT JOIN itemconditions 
        ON items.itemconditionID = itemconditions.itemconditionID
        INNER JOIN ordertoitems
        ON items.itemID = ordertoitems.itemID
        WHERE ordertoitems.orderID = "${id}"
    `)
    .catch((err)=>{
        console.log(err);
    })
    return {order: order[0][0], items: items[0]}
  }
  
async function getOrderStatusesWithout(id){
    var statuses = await pool.execute(`
        SELECT * 
        FROM orderstatuses
        WHERE orderstatusID != "${id}"
    `)
    .catch((err)=>{
        console.log(err);
    })
    return statuses[0];
}

async function updateOrder(data){
    var result;
    await pool.execute(`
        UPDATE orders
        SET 
        orderstatusID = "${data.orderstatusID}",
        workerID = "${data.workerID}"
        WHERE orderID = "${data.ID}"
        LIMIT 1
    `)
    .then(()=>{
        result = true;
    })
    .catch((err)=>{
        console.log(err);
        result = false;
    });
    return result;
}
module.exports = {getCartItemsByOrderID,submitOrder,deleteOrderItem,getOrdersByUserToken,getOrderByID,getOrderStatusesWithout,updateOrder};