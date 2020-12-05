require("dotenv").config();
const { should } = require("chai");
const knex = require("knex");
const ShoppingService = require("./shopping-list-service");

const knexInstance = knex({
  client: "pg",
  connection: process.env.DB_URL,
});

ShoppingService.getAllItems(knexInstance)
  .then((items) => console.log(items))
  .then(() =>
    ShoppingService.addItem(knexInstance, {
      name: "Jackass",
      price: "12.10",
      date_added: new Date(),
      checked: false,
      category: "Main",
    })
  )
  .then((newItem) => {
    console.log(newItem);
    return ShoppingService.updateItem(knexInstance, newItem.id, {
      name: "New Item",
    }).then(() => ShoppingService.getItemById(knexInstance, newItem.id));
  })
  .then((item) => {
    console.log(item);
    return ShoppingService.deleteItem(knexInstance, item.id);
  });
