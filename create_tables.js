const pool = require("./init.js");

const request= [];

function createTables(){
  //0 Пользователь
    request[request.length] = `create table if not exists users(
        userID int not null auto_increment,
        usersurname nvarchar(30) null,
        username nvarchar(30) null,
        usermidname nvarchar(30) null,
        userlogin varchar(20) not null,
        userpassword varchar(100) not null,
        useremail nvarchar(30) not null,
        userphone nvarchar(11) null,
        userpassport nvarchar(10) null,
        userpassportby nvarchar(50) null,
        userpassportdate date null,
        primary key(userID)
      )`;
      //1 Работник
      request[request.length] =`create table if not exists workers(
        workerID tinyint not null auto_increment,
        workersalary mediumint not null,
        workerexperience tinyint default 0,
        workersurname nvarchar(30) not null,
        workername nvarchar(30) not null,
        workeremail nvarchar(30) not null,
        workermidname nvarchar(30),
        workerlogin varchar(20) not null,
        workerpassword varchar(100) not null,
        workerphone nvarchar(11) not null,
        workerpassport nvarchar(10) not null,
        workerpassportby nvarchar(50) not null,
        workerpassportdate date not null,
        primary key(workerID)
      )`;
      //2 статус заказа
      request[request.length] =`create table if not exists orderstatuses(
        orderstatusID tinyint not null auto_increment,
        orderstatusname varchar(20) not null,
        primary key(orderstatusID)
      )`;      
      //3 Заказ
      request[request.length] =`create table if not exists orders(
        orderID int not null auto_increment,
        orderdate date null,
        workerID tinyint null,
        userID int not null,
        orderstatusID tinyint null,
        foreign key(workerID) references workers(workerID),
        foreign key(userID) references users(userID) on delete cascade,
        foreign key(orderstatusID) references orderstatuses(orderstatusID),
        primary key(orderID)        
        )`;
      //4 статус договора
      request[request.length] =`create table if not exists contractstatuses(
        contractstatusID tinyint not null auto_increment,
        contractstatusname varchar(20) not null,
        primary key(contractstatusID)
      )`;
      //5 договоры
      request[request.length] =`create table if not exists contracts(
        contractID int not null auto_increment,
        contractdate date null,
        userID int,
        contractstatusID tinyint,
        foreign key(userID) references users(userID),
        foreign key(contractstatusID) references contractstatuses(contractstatusID),
        primary key(contractID)
      )`;
      //6 Статус товара
      request[request.length] =`create table if not exists itemstatuses(
        itemstatusID tinyint not null auto_increment,
        itemstatusname varchar(30) not null,
        primary key(itemstatusID)
      )`;
      //7 Категории
      request[request.length] =`create table if not exists categories(
        categoryID tinyint not null auto_increment,
        categoryname varchar(30) not null,
        primary key(categoryID)
      )`;
      //8 Состояние товара
      request[request.length] =`create table if not exists itemconditions(
        itemconditionID tinyint not null auto_increment,
        itemconditionname varchar(20) not null,
        primary key(itemconditionID)
      )`;
      //9 Товары
      request[request.length] =`create table if not exists items(
        itemID int not null auto_increment,
        itemname varchar(50) not null,
        itemdescription varchar(1000) not null,
        itemimagepath varchar(1000) not null,
        itemcount int not null,
        itemprice int not null,
        itemisrentable tinyint(1) not null,
        itemauthor varchar(50) not null,
        itemagelimit tinyint not null,
        categoryID tinyint,
        itemstatusID tinyint,
        itemconditionID tinyint,
        foreign key(categoryID) references categories(categoryID),
        foreign key(itemstatusID) references itemstatuses(itemstatusID),
        foreign key(itemconditionID) references itemconditions(itemconditionID),
        primary key(itemID)
      )`;
      //10 Договор/товар
      request[request.length] =`create table if not exists contracttoitems(
        contractitemdeadline date null,
        itemID int,
        contractID int,
        foreign key(itemID) references items(itemID) on delete cascade,
        foreign key(contractID) references contracts(contractID) on delete cascade
      )`;
      //11 Заказ/товар
      request[request.length] =`create table if not exists ordertoitems(
        orderID int,
        itemID int,
        itemcount tinyint default 1,
        foreign key(orderID) references orders(orderID),
        foreign key(itemID) references items(itemID)
      )`;
      //12 Поставщик
      request[request.length] =`create table if not exists providers(
        providerID tinyint not null auto_increment,
        providername nvarchar(30) not null,
        provideradress nvarchar(30) not null,
        workerlogin varchar(20) not null,
        providermail varchar(30) not null,
        providerphone nvarchar(11) not null,
        primary key (providerID)
      )`;
      //13 Поставка
      request[request.length] =`create table if not exists supplies(
        supplyID int not null auto_increment,
        supplydate date not null,
        supplyprice int not null,
        providerID tinyint,
        foreign key(providerID) references providers(providerID),
        primary key (supplyID)
      )`;
      //14 Поставка/товар
      request[request.length] =`create table if not exists supplytoitem(
        supplyID int not null,  
        itemID int not null,
        foreign key(supplyID) references supplies(supplyID),
        foreign key(itemID) references items(itemID)
      )`;
      //15 Админы
      request[request.length] =`create table if not exists admins(
        adminID int not null auto_increment,  
        adminlogin varchar(30) not null,
        adminemail varchar(30) not null,
        adminpassword varchar(100) not null,
        primary key(adminID)
      )`;
      fill();
      
};

function fill(){
  for(let i = 0;i <request.length;i++)
  {
    pool.execute(request[i])
          .then(()=>{
            //console.log("Таблица номер " + i +" создана")
          })
          .catch(err=>{
            console.log("Ошибка в таблице под номером: "+i)
            console.log(err);
          });
      }
};

module.exports = {createTables};