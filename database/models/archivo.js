// Archivos varios
const mongoose = require('../connect');
const Schema = mongoose.Schema;

const archivoSchema = Schema({
    nombre : String,
    usuario:{
        type: Schema.Types.ObjectId,
        ref: "Usuario",
        require:'Falta info de Docente'
    },
    path : String,   
    fechaRegistro: {
        type: Date,
        default: Date.now()
    }
});

const archivo = mongoose.model('Archivo', archivoSchema);

module.exports = archivo;