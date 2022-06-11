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
        WHERE items.itemisrentable = 1
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

async function getContractItemsByContractID(contractID){
    let items = await pool.execute(`
        SELECT * FROM items
        LEFT JOIN categories 
        ON items.categoryID = categories.categoryID
        LEFT JOIN itemstatuses 
        ON items.itemstatusID = itemstatuses.itemstatusID
        LEFT JOIN itemconditions 
        ON items.itemconditionID = itemconditions.itemconditionID
        INNER JOIN contracttoitems
        ON items.itemID = contracttoitems.itemID
        WHERE contracttoitems.contractID = "${contractID}"
    `)
    .catch(err =>{
        console.log(err);
    });
    return items[0];
  };

  async function submitContract(data){
    var result;
    await pool.execute(`
        UPDATE contracts
        SET
        contractstatusID = "1"
        WHERE contractID = "${data.ID}"
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

  async function deleteContractItem(data){
    var result;
    await pool.execute(`
        DELETE 
        FROM contracttoitems
        WHERE contractID="${data.ID}" AND itemID="${data.itemID}"
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
module.exports = {getRentableItems, getItemByID,getContractItemsByContractID, submitContract,deleteContractItem};