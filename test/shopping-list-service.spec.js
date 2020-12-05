require("dotenv").config();
const { expect } = require("chai");
const supertest = require("supertest");
const ShoppingService = require("../src/shopping-list-service");
const knex = require("knex");

describe(`Shopping Service Object`, function () {
  let db;
  let testItems = [
    {
      id: 1,
      name: "Fish",
      price: "12.10",
      date_added: new Date("2029-01-22T16:28:32.615Z"),
      checked: false,
      category: "Main",
    },
    {
      id: 2,
      name: "Sausage",
      price: "3.10",
      date_added: new Date("2029-01-22T16:28:32.615Z"),
      checked: true,
      category: "Main",
    },
    {
      id: 3,
      name: "Beef",
      price: "30.10",
      date_added: new Date("2029-01-22T16:28:32.615Z"),
      checked: false,
      category: "Main",
    },
    {
      id: 4,
      name: "Horse",
      price: "40.10",
      date_added: new Date("2029-01-22T16:28:32.615Z"),
      checked: false,
      category: "Main",
    },
    {
      id: 5,
      name: "Chicken",
      price: "12.10",
      date_added: new Date("2029-01-22T16:28:32.615Z"),
      checked: false,
      category: "Main",
    },
  ];
  before(() => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL,
    });
  });
  before(() => db("shopping_list").truncate());
  afterEach(() => db("shopping_list").truncate());
  after(() => db.destroy());
  describe(`getAllItems()`, () => {
    beforeEach(() => {
      return db.into("shopping_list").insert(testItems);
    });
    it(`resolves articles from 'shopping_list' table`, () => {
      return ShoppingService.getAllItems(db).then((actual) => {
        expect(actual).to.eql(testItems);
      });
    });
    it(`getItemById() resolves an article by id from 'shopping_list', table`, () => {
      const testId = 4;
      const testItem = testItems[testId - 1];
      return ShoppingService.getItemById(db, testId).then((actual) => {
        expect(actual).to.eql({
          id: testId,
          name: testItem.name,
          price: testItem.price,
          date_added: testItem.date_added,
          checked: testItem.checked,
          category: testItem.category,
        });
      });
    });
    it(`deleteItem() removes an article by id from 'shopping_list' table`, () => {
      const itemId = 2;
      return ShoppingService.deleteItem(db, itemId)
        .then(() => ShoppingService.getAllItems(db))
        .then((allItems) => {
          const expected = testItems.filter((item) => item.id !== itemId);
          expect(allItems).to.eql(expected);
        });
    });
    it(`updateItem() updates an article from the 'shopping_list' table`, () => {
      const itemUpdateId = 2;
      const newItemData = {
        name: "name updated",
        price: "3.10",
        date_added: new Date("2029-01-22T16:28:32.615Z"),
        checked: false,
        category: "Snack",
      };
      return ShoppingService.updateItem(db, itemUpdateId, newItemData)
        .then(() => ShoppingService.getItemById(db, itemUpdateId))
        .then((item) => {
          expect(item).to.eql({
            id: itemUpdateId,
            ...newItemData,
          });
        });
    });
  });
  describe(`shopping_list totally empty`, () => {
    it(`getAllItems() resolves an empty array`, () => {
      return ShoppingService.getAllItems(db).then((actual) => {
        expect(actual).to.eql([]);
      });
    });
    it(`addItem() inserts a new item with an id`, () => {
      const newItem = {
        id: 1,
        name: "GOUDA",
        price: "1000.10",
        date_added: new Date("2029-01-22T16:28:32.615Z"),
        checked: false,
        category: "Snack",
      };
      return ShoppingService.addItem(db, newItem).then((actual) => {
        expect(actual).to.eql({
          id: 1,
          name: newItem.name,
          price: newItem.price,
          date_added: newItem.date_added,
          checked: newItem.checked,
          category: newItem.category,
        });
      });
    });
  });
});
