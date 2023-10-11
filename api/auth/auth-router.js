const router = require('express').Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const db = require('../../data/dbConfig')


const { JWT_SECRET } = require('../../config')

const User = require('../users/users-model')
const { nameCheck } = require('./auth-middleware')


const insert = async (user) => {
    
  const hash = bcrypt.hashSync(user.password, 4)

  user.password = hash


  const newUser = await db('users').insert({username: user.username, password:user.password})

  

  return await db('users').where('id', newUser).first()
}






router.post('/register', nameCheck, async (req, res, next) => {

  try {

    const newUser = await insert(req.body)

    res.json(newUser)
    

  } catch (error) {
    next(error)
  }
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
});

router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password || !username.trim() || !password.trim()) {
        return res.json({ message: 'username and password required' });
    }

    const user = await User.findBy('username', username);

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.json({ message: 'invalid credentials' });
    }

    const token = buildToken(user);
    req.headers.authorization = token;
    
    return res.json({ message: `welcome, ${username}`, token });
} catch (error) {
    next(error)
}

  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
});

router.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err,
    customMessage: "Something bad happened within the accounts router"
  });
});


function buildToken(user) {
  const payload = {
    subject: user.id,
    username: user.username
  }

  const options = {
    expiresIn: '1d',
  }

  return jwt.sign(payload, JWT_SECRET ,options)

}

module.exports = router
