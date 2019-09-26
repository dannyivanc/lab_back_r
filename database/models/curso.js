const mongoose = require('../connect');
const Schema = mongoose.Schema;

const cursoSchema = Schema({
    materia: {
        type: Schema.Types.ObjectId,
        ref: "Materia",
        require:'Falta info de Materia'
    },
    docente: {// /api/user/id ?
        type: Schema.Types.ObjectId,
        ref: "Usuario",
        require:'Falta info del Docente'
    },
    gestion: {   // 00/0000 ex 01/2019
        type: String,
        required: 'Falta la Gestion'
    },  
    grupo: {   // 1, 2 , etc
        type: Number,
        required: 'Falta el numero de grupo'
    },
    fechaRegistro: {
        type: Date,
        default: Date.now()
    }
});

const curso = mongoose.model('Curso', cursoSchema);

module.exports = curso;