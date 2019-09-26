//laboratorio de un estudiante
const mongoose = require('../connect');
const Schema = mongoose.Schema;

const laboratorioSchema = Schema({
    guia: { // id de la guia
        type: Schema.Types.ObjectId,
        ref: "Guia",
        require:'Falta info de Guia'
    },
    estudiante: { //id del estudiante 
        type: Schema.Types.ObjectId,
        ref: "Usuario",
        require:'Falta info del Estudiante'
    },
    nota: {   //la nota total del alboratorio
        type: Number,
        required: 'Falta la Nota',
        default:0
    },
    estado: {   // pendiente , por revisar, revisado
        type: String,
        required: 'Es necesario el estado',
        default: 'pendiente'
    },    
    tiempo: Number, // en milisegundos   //opcional     
    fechaRegistro: {
        type: Date,
        default: Date.now()
    }
});

const laboratorio = mongoose.model('Laboratorio', laboratorioSchema);

module.exports = laboratorio;