const db = require('../../data/dbConfig')

const nameCheck = async (req, res, next) => {
    try {

        

        
        const user = await db('users').where('username', req.body.username).first()

        console.log(user)


        if(user){
            res.status(401).json({message: "username taken"})
        }else{
            next()
        }

        
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}



module.exports = {
    nameCheck,
    
}