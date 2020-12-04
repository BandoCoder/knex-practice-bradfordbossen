require("dotenv").config();
const knex = require("knex");

const knexInstance = knex({
  client: "pg",
  connection: process.env.DB_URL,
});

function searchByItemName(searchTerm) {
  knexInstance
    .select("id", "name", "price", "date_added", "checked", "category")
    .from("shopping_list")
    .where("name", "ILIKE", `%${searchTerm}%`)
    .then((result) => {
      console.log(result);
    });
}

// searchByItemName("Tofurkey");

function paginateItems(pageNumber) {
  const itemsPerPage = 6;
  const offset = itemsPerPage * (pageNumber - 1);
  knexInstance
    .select("id", "name", "price", "date_added", "checked", "category")
    .from("shopping_list")
    .limit(itemsPerPage)
    .offset(offset)
    .then((result) => {
      console.log(result);
    });
}

// paginateItems(2);

function itemsAfterDate(daysAgo) {
  knexInstance
    .select("id", "name", "price", "date_added", "checked", "category")
    .from("shopping_list")
    .where(
      "date_added",
      ">",
      knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
    )
    .then((result) => {
      console.log(result);
    });
}

//itemsAfterDate(3);
