const db = require('../../data/dbConfig')

const nameCheck = async (req, res, next) => {
    try {

        if(!req.body.username || !req.body.password){
            res.json({message: 'username and password required'})
        }

        if(!req.body.username.trim() || !req.body.password.trim()){
            res.json({message: "username and password required"})
          }

        
        const user = await db('users').where('username', req.body.username).first()

        if(user){
            res.json({message: "username taken"})
        }else{
            next()
        }

        
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}



module.exports = {nameCheck}