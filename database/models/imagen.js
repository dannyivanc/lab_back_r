
const mongoose = require('../connect');
const Schema = mongoose.Schema;

const imagenSchema = Schema({
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

const imagen = mongoose.model('Imagen', imagenSchema);

module.exports = imagen;