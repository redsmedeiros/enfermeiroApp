const jwt = require('jsonwebtoken')
const getToken = require('./get-token')

//midleware de validação
const checkToken = (req, res, next)=>{

    if(!req.headers.authorization){
        return res.status(401).json({message: 'Não autorizado'}) 
    }

    const token = getToken(req)

    if(!token){
        return res.status(401).json({message: 'Não autorizado'})
    }

    try{

        const verified = jwt.verify(token, 'cade432mui987glick')

        req.user = verified

        next()

    }catch(error){

        return res.status(401).json({message: 'Token inválido'})
    }

}

module.exports = checkToken