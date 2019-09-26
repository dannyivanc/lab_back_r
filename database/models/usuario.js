const mongoose = require('../connect');
const Schema = mongoose.Schema;

const usuarioSchema = Schema({
    nombre: {
        type: String,
        required: 'Falta el nombre'
    },
    email: {
        type: String,
        required: 'Falta el email',
       // match: /^(([^<>()\[\]\.,;:\s @\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
    },
    password: String,
    telefono: Number,
    avatar: String,
    tipo: {
        type: String,
        required: 'Debe seleccionar tipo de usuario',
        enum: ['docente', 'estudiante']//rol
    }, 
    ci:{
        type: String,
        required: 'Debe tener un CI',
    },
    rud:{
        type: String,
        required: 'Debe tener un RU o RD',
    },
    archivosCompartidos:[{ //solo para el docente
        type: Schema.Types.ObjectId,
        ref: "Archivo"
    }],
    fechaRegistro: {
        type: Date,
        default: Date.now()
    },

});

const usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = usuario;