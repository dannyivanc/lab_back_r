//Guia  de un Curso
const mongoose = require('../connect');
const Schema = mongoose.Schema;

const guiaSchema = Schema({
    curso: {
        type: Schema.Types.ObjectId,
        ref: "Curso",
        require:'Falta info de Curso'
    },
    docente: {
        type: Schema.Types.ObjectId,
        ref: "Usuario",
        require:'Falta info de Docente'
    },
    numero: {   // 1, 2 , etc
        type: Number,
        required: 'Falta el numero de guia'
    },    
    contenidoHtml: {  
        //intro o texto renderizado a html antes de las preguntas
        type: String,
        required: 'Falta titulo y/o descripcion'
    },      
    fechaRegistro: {
        type: Date,
        default: Date.now()
    }
});

const guia = mongoose.model('Guia', guiaSchema);

module.exports = guia;