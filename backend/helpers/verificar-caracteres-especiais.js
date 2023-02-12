const verificarCaracteresEspeciais = (password)=>{

    const res = /\W|_/;

    return res.test(password)
}

module.exports = verificarCaracteresEspeciais