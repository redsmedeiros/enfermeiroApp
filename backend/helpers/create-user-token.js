//importações
const jwt = require('jsonwebtoken')

//função de criar token
const createUserToken = async (user, req, res) =>{

    //atraves do metodo sign enviar as informações pelo token
    const token = jwt.sign({
        name: user.name,
        id: user._id
    }, "cade432mui987glick")

    res.status(200).json({
        message: 'Você está autenticado',
        token: token,
        userId: user._id
    })

}

module.exports = createUserToken