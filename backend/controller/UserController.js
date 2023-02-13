//importações
const User = require('../models/User')
const bcrypt = require('bcrypt')
const validarEmail = require('../helpers/validar-email')
const verificarCaracteresEspeciais = require('../helpers/verificar-caracteres-especiais')
const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')
const jwt = require('jsonwebtoken')

module.exports = class UserController{

    //metodo para registrar o usuario
    static async register(req, res){
        
        const { name, email, phone, password, confirmPassword } = req.body

        //retornar as validações
        if(!name){
            res.status(422).json({message: 'O nome é obrigatório!'})
            return;
        }

        if(!email){
            res.status(422).json({message: 'O email é obrigatório!'})
            return;
        }

        if(validarEmail(email) === false){
            res.status(422).json({message: 'O email precisa ser válido!'})
            return;
        }

        if(!phone){
            res.status(422).json({message: 'O phone é obrigatório!'})
            return;
        }

        if(!password){
            res.status(422).json({message: 'O password é obrigatório!'})
            return;
        }

        if(password.length < 6){
            res.status(422).json({message: 'Password precisa ter pelo menos 6 caracters'})
            return;
        }

        if(verificarCaracteresEspeciais(password) === false){
            res.status(422).json({message: 'Password precisa ter caracteres especiais'})
            return;
        }

        if(!confirmPassword){
            res.status(422).json({message: 'O confirmPassword é obrigatório!'})
            return;
        }

        if(password !== confirmPassword){
            res.status(422).json({message: 'A confirmação é diferente da senha!'})
            return;
        }

        //verificar o usuario no banco
        const userExists = await User.findOne({email: email})

        if(userExists){
            res.status(422).json({message: 'O email já está cadastrado'})
            return;
        }

        //criptografar a senha
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        //instanciar o usuario
        const user = new User({
            name: name,
            email: email,
            password: passwordHash,
            phone: phone 
        })

        //salvar no banco
        try{

            const newUser = await user.save()

            await createUserToken(newUser, req, res)

        }catch(error){

            res.status(500).json(error)
        }

    }

    //metodo para fazer login
    static async login(req, res){

        const { email, password } = req.body

        //validações
        if(!email){
            res.status(422).json({message: 'Email é obrigatório'})
            return;
        }

        if(!password){
            res.status(422).json({message: 'Password é obrigatório'})
            return;
        }

        //buscar o usuario
        const user = await User.findOne({email: email})

        if(!user){
            res.status(422).json({message: 'Usuário não encontrado'})
            return;
        }

        //fazer a verificação da senha
        const checkPassword = await bcrypt.compare(password, user.password)

        if(!checkPassword){
            res.status(422).json({message: 'Senha inválida'})
            return;
        }

        //fazer o login com o token
        await createUserToken(user, req, res)

    }

    //metodo para obter usuario
    static async checkUser(req, res){

        let currentUser

        //verificar a autorização
        if(req.headers.authorization){

            const token = getToken(req)

            //decodificar token
            const decoded = jwt.verify(token, 'cade432mui987glick')

            try{

                currentUser = await User.findById(decoded.id)

                currentUser.password = undefined
            }catch(error){

                res.send(error)
            }

        }else{

            currentUser = null
        }

        res.status(200).send(currentUser)

    }

    //pegar um usuario
    static async getUserById(req, res){

        const { id } = req.params

        const user = await User.findById(id).select('-password')

        if(!user){
            res.status(422).json({message: 'Usuário não encontrado'})
            return;
        }

        res.status(200).json({user})

    }

    //edição de usuários
    static async editUser(req, res){

        const { id } = req.params

        const { name, email, phone, password, confirmPassword } = req.body

        const user = await User.findById(id)

        if(!user){
            res.status(422).json({message: 'Usuário não encontrado'})
            return;
        }

        if(name){
            user.name = name
        }

        if(email){
            user.email = email
        }

        if(phone){
            user.phone = phone
        }

        if(password && password === confirmPassword){
            //criptografar a senha
            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(password, salt)
            user.password = passwordHash
        }else{
            res.status(422).json({message: 'Password precisa ser igual a confirmação'})
            return;
        }

        res.send({user})
    }

}