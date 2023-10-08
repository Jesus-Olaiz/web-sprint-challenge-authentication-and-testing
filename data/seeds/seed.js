/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

const bcrypt = require('bcryptjs')


exports.seed = async function(knex) {

  const hash = bcrypt.hashSync("123", 14)

  await knex('users').truncate()
  await knex('users').insert([
    {username: 'User-01', password: hash},
    {username: 'User-02', password: hash},
    {username: 'User-03', password: hash}
  ]);
};
