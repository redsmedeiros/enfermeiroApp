//importações
const User = require('../models/User')
const bcrypt = require('bcrypt')
const validarEmail = require('../helpers/validar-email')
const verificarCaracteresEspeciais = require('../helpers/verificar-caracteres-especiais')
const createUserToken = require('../helpers/create-user-token')

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

    }

}