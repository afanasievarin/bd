const pool = require('../init.js');

async function getItems(){
    let items = await pool.execute(`
        SELECT * FROM items
        INNER JOIN categories 
        ON items.categoryID = categories.categoryID
        INNER JOIN itemstatuses 
        ON items.itemstatusID = itemstatuses.itemstatusID
        INNER JOIN itemconditions 
        ON items.itemconditionID = itemconditions.itemconditionID
        WHERE items.itemisrentable = 0
    `)
    .catch(err =>{
        console.log(err);
    });
    return items[0];
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

async function getItemsUpdateData(){
        let itemconditions = await pool.execute(`
        SELECT *
        FROM itemconditions
        `)
        .catch(err=>{
          console.log(err);
        });
        let itemstatuses = await pool.execute(`
        SELECT *
        FROM itemstatuses
        `)
        .catch(err=>{
          console.log(err);
        });
        let categories = await pool.execute(`
        SELECT *
        FROM categories
        `)
        .catch(err=>{
          console.log(err);
        });
        
        return {itemconditions: itemconditions[0],itemstatuses: itemstatuses[0], categories: categories[0]}
      
}

async function createItem(data){
    var result;
    var rent = 0;
    if(data.isrentable) rent = 1;
      await pool.execute(`
          INSERT items(itemname,itemdescription, itemimagepath, itemcount, itemprice, itemisrentable, itemauthor, itemagelimit, categoryID, itemstatusID,itemconditionID)
          VALUES ("${data.name}","${data.description}","${data.imagepath}","${data.count}","${data.price}",
          "${rent}","${data.author}","${data.agelimit}","${data.categoryID}","${data.statusID}","${data.conditionID}")
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

async function updateItem(data){
    var result;
    var rent = 0;
    if(data.isrentable) rent = 1;
    await pool.execute(`
        UPDATE items
        SET 
        itemname = "${data.name}",
        itemdescription = "${data.description}",
        itemimagepath = "${data.imagepath}",
        itemcount = "${data.count}",
        itemprice = "${data.price}",
        itemisrentable = "${rent}",
        itemauthor = "${data.author}",
        itemagelimit ="${data.agelimit}",
        categoryID = "${data.categoryID}",
        itemstatusID = "${data.statusID}",
        itemconditionID = "${data.conditionID}"
        WHERE itemID = "${data.ID}"
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

async function deleteParameterForID(type,id){
    var result;
    var table =type;
    if(table ==="category") table = "categorie";
    if(table ==="itemstatus") table = "itemstatuse";
    await pool.execute(`
        DELETE 
        FROM ${table}s
        WHERE ${type}ID = "${id}"
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

  async function editParameters(data){
    var result;
    
    if(data.createdata.categories && data.createdata.categories.length > 0)
      await pool.query(`
        INSERT INTO categories(categoryname)
        VALUES ?`,[data.createdata.categories])
      .then(()=>{
        result =true;
      })
      .catch(err=>{
          console.log(err);
          result = false;
      });

    if(data.createdata.itemstatuses && data.createdata.itemstatuses.length > 0)
      await pool.query(`
        INSERT INTO itemstatuses(itemstatusname)
        VALUES ?`,[data.createdata.itemstatuses])
      .then(()=>{
        result =true;
      })
      .catch(err=>{
          console.log(err);
          result = false;
      });
    if(data.createdata.itemconditions && data.createdata.itemconditions.length > 0)
      await pool.query(`
        INSERT INTO itemconditions(itemconditionname)
        VALUES ?`,[data.createdata.itemconditions])
      .then(()=>{
        result =true;
      })
      .catch(err=>{
          console.log(err);
          result = false;
      });
  
    if(data.editdata.itemstatuses)
    for(const element of data.editdata.itemstatuses){
      await pool.execute(`
      UPDATE itemstatuses
      SET itemstatusname = "${element[1]}"
      WHERE itemstatusID = "${element[0]}"`)
    .then(()=>{
      result =true;
    })
    .catch(err=>{
        console.log(err);
        result = false;
    });
    };
    
    if(data.editdata.itemconditions)
    for(const element of data.editdata.itemconditions){
      await pool.execute(`
      UPDATE itemconditions
      SET itemconditionname = "${element[1]}"
      WHERE itemconditionID = "${element[0]}"`)
    .then(()=>{
      result =true;
    })
    .catch(err=>{
        console.log(err);
        result = false;
    });
    };
    if(data.editdata.categories)
    for(const element of data.editdata.categories){
      await pool.execute(`
      UPDATE categories
      SET categoryname = "${element[1]}"
      WHERE categoryID = "${element[0]}"`)
    .then(()=>{
      result =true;
    })
    .catch(err=>{
        console.log(err);
        result = false;
    });
    };
    return result;
  }

  async function createOrder(userID){
      await pool.execute(`
        INSERT orders(userID)
        VALUES ("${userID}")
      `)
      .catch((err)=>{
          console.log(err);
      })
  }

  async function createContract(userID){
    await pool.execute(`
      INSERT contracts(userID)
      VALUES ("${userID}")
    `)
    .catch((err)=>{
        console.log(err);
    })
}

  async function findEmptyOrder(userID){
    var data = await pool.execute(`
        SELECT *
        FROM orders
        WHERE userID = "${userID}" AND orderstatusID is null
        LIMIT 1
    `)
    .catch(err=>{
        console.log(err);
    });
    return data[0];
  }

  async function findEmptyContract(userID){
    var data = await pool.execute(`
        SELECT *
        FROM contracts
        WHERE userID = "${userID}" AND contractstatusID is null
        LIMIT 1
    `)
    .catch(err=>{
        console.log(err);
    });
    return data[0];
  }

  async function addItemToContractByID(id, userID){

    var data = await findEmptyContract(userID);
    if(!data[0]) 
    {
      await createContract(userID);
      data = await findEmptyContract(userID);
    }

  var result;
    result = await pool.execute(`
      INSERT contracttoitems(contractID, itemID)
      VALUES ("${data[0].contractID}",${id})
    `)
    .then(()=>{
      result =true;
    })
    .catch(err=>{
        console.log(err);
        result = false;
    });
      return result;
    };

  async function addItemToCartByID(id, userID){

    var data = await findEmptyOrder(userID);
    if(!data[0]) 
    {
      await createOrder(userID);
      data = await findEmptyOrder(userID);
    }

  var result;
    result = await pool.execute(`
      INSERT ordertoitems(orderID, itemID)
      VALUES ("${data[0].orderID}",${id})
    `)
    .then(()=>{
      result =true;
    })
    .catch(err=>{
        console.log(err);
        result = false;
    });
      return result;
    };


module.exports = {
  getItems,
  getItemByID,
  getItemsUpdateData,
  createItem,updateItem,
  deleteParameterForID,
  editParameters,
  addItemToCartByID,
  addItemToContractByID,
  findEmptyOrder,
  findEmptyContract
  };
