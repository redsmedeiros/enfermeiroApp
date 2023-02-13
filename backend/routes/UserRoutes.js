//importações
const router = require('express').Router()
const UserController = require('../controller/UserController')

//rotas
router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.get('/check-user', UserController.checkUser)
router.get('/:id', UserController.getUserById)
router.get('/edit/:id', UserController.editUser)

module.exports = router