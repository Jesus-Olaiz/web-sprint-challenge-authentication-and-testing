const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../../config')

module.exports = (req, res, next) => {





  try {

    const token = req.headers.authorization
    

    if (token) {
      jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if(err){
          res.json({message: `token invalid`})
        } else{
          next()
        }
      } )
    }else {
      res.json({message: 'token required'})
    }
    
    
  } catch (error) {
    res.status(500).json({message: error.message})
  }
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
};
