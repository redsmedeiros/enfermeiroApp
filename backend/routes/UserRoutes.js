//importações
const router = require('express').Router()
const UserController = require('../controller/UserController')

//middleware
const verifyToken = require('../helpers/verify-token')

//rotas
router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.get('/check-user', UserController.checkUser)
router.get('/:id', UserController.getUserById)
router.patch('/edit/:id', verifyToken, UserController.editUser)

module.exports = router