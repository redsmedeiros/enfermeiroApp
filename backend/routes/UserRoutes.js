//importações
const router = require('express').Router()
const UserController = require('../controller/UserController')

//rotas
router.post('/register', UserController.register)

module.exports = router