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
    //console.log(items[0]);
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
    var rent;
    if(data.isrentable) rent = 1;
    else rent = 0;
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
module.exports = {getItems, getItemByID,getItemsUpdateData, createItem};
