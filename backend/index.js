//importações
const express = require('express')
const cors = require('cors')

//instancia da aplicação
const app = express()

//configurações
app.use(express.json())
app.use(cors({credentials: true, origin: 'http://localhost:3000'}))
app.use(express.static('public'))

//gerenciamento de rotas

//escutar servidor
const port = 5000
app.listen(port, ()=> console.log(`Servidor na porta ${port}`))