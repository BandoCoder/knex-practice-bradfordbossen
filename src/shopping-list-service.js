const ShoppingService = {
  getAllItems(knex) {
    return knex.select("*").from("shopping_list");
  },
  getItemById(knex, id) {
    return knex.from("shopping_list").select("*").where("id", id).first();
  },
  deleteItem(knex, id) {
    return knex("shopping_list").where({ id }).delete();
  },
  updateItem(knex, id, newItemData) {
    return knex("shopping_list").where({ id }).update(newItemData);
  },
  addItem(knex, newItem) {
    return knex
      .insert(newItem)
      .into("shopping_list")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
};

module.exports = ShoppingService;
