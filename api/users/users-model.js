const db = require('../../data/dbConfig')
const bcrypt = require('bcryptjs')



const findBy = async (filter, condition) => {
    const user = await db('users').where(filter, condition).first()
    
    return user
}

const insert = async (user) => {
    
    const hash = bcrypt.hashSync(user.password, 4)

    user.password = hash


    const newUser = await db('users').insert({username: user.username, password:user.password})

    

    return await db('users').where('id', newUser).first()
}


module.exports = {
    findBy,
    insert
}