const mongoose = require('../connect');
const Schema = mongoose.Schema;

const materiaSchema = Schema({
    nombre: {   
        type: String,
        required: 'Falta el nombre'
    },   
    sigla: {   
        type: String,
        required: 'Falta la sigla'
    },
    nivel: {   
        type: Number,
        required: 'Falta el nivel'
    }, 
    fechaRegistro: {
        type: Date,
        default: Date.now()
    }
});

const materia = mongoose.model('Materia', materiaSchema);

module.exports = materia;