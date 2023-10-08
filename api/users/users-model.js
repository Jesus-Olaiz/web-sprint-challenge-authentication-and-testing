const db = require('../../data/dbConfig')
const bcrypt = require('bcryptjs')



const findBy = (filter, condition) => {
    const user = db('users').where(`${filter}`, condition).first()
    return user
}

const insert = async (user) => {
    
    const hash = bcrypt.hashSync(user.password, 14)

    user.password = hash


    const newUser = await db('users').insert({username: user.username, password:user.password})

    const foundUser = await db('users').where('id', newUser[0]).first()

    return foundUser
}


module.exports = {
    findBy,
    insert
}