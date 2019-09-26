//Integrante de un Curso
const mongoose = require('../connect');
const Schema = mongoose.Schema;

const integranteSchema = Schema({
    curso: {
        type: Schema.Types.ObjectId,
        ref: "Curso",
        require:'Falta info de Curso'
    },
    estudiante: {
        type: Schema.Types.ObjectId,
        ref: "Usuario",
        require:'Falta info del Estudiante'
    },
    gestion: {   // es necesario ???? 00/0000 ex 01/2019 
        type: String,
        required: 'Falta la Gestion'
    },  
    nota: {   // 1, 2 , etc
        type: Number,
        required: 'Falta la nota',
        default:0
    },
    fechaRegistro: {
        type: Date,
        default: Date.now()
    }
});

const integrante = mongoose.model('Integrante', integranteSchema);

module.exports = integrante;