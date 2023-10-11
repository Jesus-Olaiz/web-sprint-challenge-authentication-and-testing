const db = require('../../data/dbConfig')

const nameCheck = async (req, res, next) => {
    try {

        let user


        if(!req.body.username || !req.body.password){
            return res.status(401).json({message: 'username and password required'})
        }
        if(!req.body.username.trim() || !req.body.password.trim()){
            return res.status(401).json({message: "username and password required"})
        }else{
            user = await db('users').where('username', req.body.username).first()
        }

        
        

        if(user){
            return res.status(403).json({message: "username taken"})
        }

        next() 

        
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}



module.exports = {nameCheck}