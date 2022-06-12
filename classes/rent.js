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
    var temp = new Date();
    var date = temp.getFullYear()+"-"+(temp.getMonth()+1)+"-"+temp.getDate();
    await pool.execute(`
        UPDATE contracts
        SET
        contractstatusID = "1",
        contractdate = "${date}"
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

    async function getContractsByUserToken(token){
        var contracts;
        if(token.role == "2")
            contracts = await pool.execute(`
            SELECT *
            FROM contracts
            LEFT JOIN users
            ON contracts.userID = users.userID
            LEFT JOIN workers
            ON contracts.workerID = workers.workerID
            LEFT JOIN contractstatuses
            ON contracts.contractstatusID = contractstatuses.contractstatusID
            WHERE contracts.contractstatusID is not null
            `)
            .catch((err)=>{
                console.log(err);
            })
        else if(token.role == "1")
            contracts = await pool.execute(`
            SELECT *
            FROM contracts
            LEFT JOIN users
            ON contracts.userID = users.userID
            LEFT JOIN workers
            ON contracts.workerID = workers.workerID
            LEFT JOIN contractstatuses
            ON contracts.contractstatusID = contractstatuses.contractstatusID
            WHERE contracts.workerID = "${token.id}" AND contractstatuses.contractstatusID is not null
            `)
            .catch((err)=>{
                console.log(err);
            })
        else if(token.role == "0")
            contracts = await pool.execute(`
            SELECT *
            FROM contracts
            LEFT JOIN users
            ON contracts.userID = users.userID
            LEFT JOIN workers
            ON contracts.workerID = workers.workerID
            LEFT JOIN contractstatuses
            ON contracts.contractstatusID = contractstatuses.contractstatusID
            WHERE users.userID = "${token.id}" AND contractstatuses.contractstatusID is not null
            `)
            .catch((err)=>{
                console.log(err);
            })
        return contracts[0];
      }

      async function getContractByID(id){
        var contract = await pool.execute(`
            SELECT *
            FROM contracts
            LEFT JOIN users
            ON contracts.userID = users.userID
            LEFT JOIN workers
            ON contracts.workerID = workers.workerID
            LEFT JOIN contractstatuses
            ON contracts.contractstatusID = contractstatuses.contractstatusID
            WHERE contracts.contractID = "${id}"
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
            INNER JOIN contracttoitems
            ON items.itemID = contracttoitems.itemID
            WHERE contracttoitems.contractID = "${id}"
        `)
        .catch((err)=>{
            console.log(err);
        })
        return {contract: contract[0][0], items: items[0]}
      }
      
    async function getContractStatusesWithout(id){
        var statuses = await pool.execute(`
            SELECT * 
            FROM contractstatuses
            WHERE contractstatusID != "${id}"
        `)
        .catch((err)=>{
            console.log(err);
        })
        return statuses[0];
    }
    
    async function updateContract(data){
        var result;
        await pool.execute(`
            UPDATE contracts
            SET 
            contractstatusID = "${data.contractstatusID}",
            workerID = "${data.workerID}"
            WHERE contractID = "${data.ID}"
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

    async function deleteContract(id){
        var result = true;
        await pool.execute(`
            DELETE 
            FROM contracts
            WHERE contractID = "${id}"
            LIMIT 1
        `)
        .catch((err)=>{
            console.log(err);
            result = false;
        })
        return result;
      }
module.exports = {getRentableItems,deleteContract, getItemByID,getContractItemsByContractID, submitContract,deleteContractItem, getContractsByUserToken,getContractByID,getContractStatusesWithout,updateContract};