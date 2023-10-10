const request = require('supertest')
const server = require('./server')

const db = require('../data/dbConfig')
const Users = require('./users/users-model')

const jokes =  require('./jokes/jokes-data')

const newUser = {
  username: "newUser",
  password: "badPassword"
}


beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()

  // let pass = '1234'
  // let hash = bcrypt.hashSync(pass, 14)


  // await db('users').insert({username: "Olaysus", password: hash})

  await Users.insert({username:"Olaysus", password:"1234"})
})




describe('sanity', () => {
  test('PROCESS_ENV should be testing', () => {
    expect(process.env.NODE_ENV).toBe('testing');
  })
})


describe('api/auth/register endpoint', () => {

  test('[POST] /api/auth/register {payload} returns {id, username, password}' , async () => {
    const res = await request(server).post('/api/auth/register').send(newUser)
    const foundUser = await db('users').where('username', 'newUser').first()
    expect(res.body).toMatchObject(foundUser)
  })


  test('[POST] /api/auth/register {empty payload} returns expected error', async () => {
    const res = await request(server).post('/api/auth/register').send({username: '   ', password: '   '})
    expect(res.body).toMatchObject({"message": "username and password required"})
  })

  test('[POST] /api/auth/register {used payload} returns expected error', async () => {
    const res = await request(server).post('/api/auth/register').send({username:'Olaysus', password:'1234'})

    expect(res.body).toMatchObject({"message": "username taken"})
  })

})


describe('api/auth/login endpoint', () => {
  test('[POST] api/auth/login {valid credentials} returns success with token', async () => {
    const res = await request(server).post('/api/auth/login').send({username:'Olaysus', password:'1234'})

    expect(res.body).toMatchObject({"message": "welcome, Olaysus"})
    expect(res.body).toHaveProperty('token')
  })

  test('[POST] api/auth/login {empty credentials} returns expected error', async () => {
    const response = await request(server).post('/api/auth/login').send({username: "   ", password: "   "})

    expect(response.body).toMatchObject({
      "message": "username and password required"
    })

  })

  test('[POST] api/auth/login {invalid credentials} returns expected error', async () => {
    const response = await request(server).post('/api/auth/login').send({username: "Olaysus", password: "124"})

    expect(response.body).toMatchObject({
      "message": "invalid credentials"
    })
  })
})


describe('api/jokes endpoint', () => {
  test('[GET] api/jokes {valid token} returns array of jokes', async () => {
    const loggedInUser = await request(server).post('/api/auth/login').send({
      username: 'Olaysus',
      password: '1234'
    })

    const newJokes = await request(server).get('/api/jokes').set('Authorization', loggedInUser.body.token)


    expect(newJokes.body).toEqual(jokes)
  })


  test('[GET] api/jokes {no token} returns expected error', async () => {
    const res = await request(server).get('/api/jokes')

    expect(res.body).toMatchObject({
      "message": "token required"
    })
  })
  test('[GET] api/jokes {invalid token} returns expected error', async () => {
    const res = await request(server).get('/api/jokes').set('Authorization', 'secret')

    expect(res.body).toMatchObject({
      "message": "token invalid"
    })
  })
})
