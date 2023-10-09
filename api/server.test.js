const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')

const Users = require('./users/users-model')

let user = {
  username: 'Olaysus',
  password: 'thisIsABadPassword'
}
let token




describe('sanity', () => {
  test('this should be sane', () => {
    expect('sanity').toBe('sanity');
  })
})


describe('api/auth/register endpoint', () => {
  test('[POST] /api/auth/register {payload} returns {id, username, password}' , () => {

    request(server)
      .post('/auth/register')
      .send(user)
      .set('Accept', 'application/json')
      .expect(201, {id: 4, username: 'newUser', password: '$2a$14$oGN4/apgcyMFko0W9oEw8.cX0gRJWACKLdMuexXYP2Gdiovotv3Ye'})


  })

  test('[POST] /auth/register {empty payload} returns {message: "username and password required" ', () => {
    request(server)
      .post('/auth/register')
      .send({})
      .set('Accept', 'application/json')
      .expect(401, {message: 'username and password required'})
      
  })


})


describe('/auth/login endpoint', () => {

  test('[POST] /auth/login {payload} returns {message, token}', async () => {
    const res = await request(server)
      .post('/auth/login')
      .send({username: user.username, password: user.password})
      .expect(200)
      

    token = res.body.token


  })


  test('[POST] /auth/login {empty payload} returns the proper error', () => {
    request(server)
      .post('/auth/login')
      .send({})
      .set('Accept, application/json')
      .expect({
        "message": "username and password required"
      })
  })

  test('[POST] /auth/login {invalid payload} returns the proper error', () => {
      request(server)
        .post('/auth/login')
        .send({username:user.username, password:'wrongPassword'})
        .set('Accept', 'application/json')
        .expect({
          "message": "invalid credentials"
        })
  })
})

describe('/jokes/ endpoint',() => {
  test('[GET] /jokes {token} returns expected result', async () => {
    request(server)
    .get('/jokes')
    .set("Authorization", token)
    .expect(200)
  })
})