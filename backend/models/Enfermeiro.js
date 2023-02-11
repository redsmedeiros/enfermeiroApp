const mongoose = require('../db/conn')
const { Schema } = mongoose

//instancia do model de usuarios
const Enfermeiro = mongoose.model('Enfermeiro', new Schema({
   name:{
    type: String,
    required: true
   },
   age: {
    type: Number,
    required: true
   }
}, {timestamps: true}))

module.exports = Enfermeiro;