const getToken = (req)=>{

    //tirar o bearer do token
    const authHeader = req.headers.authorization

    const token = authHeader.split(' ')[1]

    return token

}

module.exports = getToken