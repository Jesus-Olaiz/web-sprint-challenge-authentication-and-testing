/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

const bcrypt = require('bcryptjs')


exports.seed = async function(knex) {

  const hash = bcrypt.hashSync("badPassword", 14)

  await knex('users').truncate()
  await knex('users').insert([
    {username: 'Olaysus', password: hash}
  ]);
};
