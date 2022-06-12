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
    var temp = new Date();
    var date = temp.getFullYear()+"-"+(temp.getMonth()+1)+"-"+temp.getDate();
    await pool.execute(`
        UPDATE orders
        SET
        orderstatusID = "1",
        orderdate = "${date}"
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

async function deleteParameterForID(type,id){
    var result = true;
    await pool.execute(`
        DELETE 
        FROM ${type}es
        WHERE ${type}ID = "${id}"
    `)
    .catch(err=>{
        console.log(err);
        result = false;
    });
    return result;
  }

  async function editParameters(data){
    var result = true;
    
    if(data.createdata.orderstatuses && data.createdata.orderstatuses.length > 0)
      await pool.query(`
        INSERT INTO orderstatuses(orderstatusname)
        VALUES ?`,[data.createdata.orderstatuses])
      .catch(err=>{
          console.log(err);
          result = false;
      });

    if(data.createdata.contractstatuses && data.createdata.contractstatuses.length > 0)
      await pool.query(`
        INSERT INTO contractstatuses(contractstatusname)
        VALUES ?`,[data.createdata.contractstatuses])
      .catch(err=>{
          console.log(err);
          result = false;
      });

    if(data.editdata.contractstatuses)
    for(const element of data.editdata.contractstatuses){
      await pool.execute(`
      UPDATE contractstatuses
      SET contractstatusname = "${element[1]}"
      WHERE contractstatusID = "${element[0]}"`)
    .catch(err=>{
        console.log(err);
        result = false;
    });
    };
    
    if(data.editdata.orderstatuses)
    for(const element of data.editdata.orderstatuses){
      await pool.execute(`
      UPDATE orderstatuses
      SET orderstatusname = "${element[1]}"
      WHERE orderstatusID = "${element[0]}"`)
    .catch(err=>{
        console.log(err);
        result = false;
    });
    };
    
    return result;
  }

  async function deleteOrder(id){
    var result = true;
    await pool.execute(`
        DELETE 
        FROM orders
        WHERE orderID = "${id}"
        LIMIT 1
    `)
    .catch((err)=>{
        console.log(err);
        result = false;
    })
    return result;
  }

module.exports = {getCartItemsByOrderID,deleteOrder,submitOrder,deleteOrderItem,getOrdersByUserToken,getOrderByID,getOrderStatusesWithout,updateOrder, deleteParameterForID, editParameters};