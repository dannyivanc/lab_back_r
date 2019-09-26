var express = require('express');
var router = express.Router();


const Respuesta = require('../../database/models/respuesta');


/* Agregar nuevo Respuesta */
router.post("/", (req, res) => {
    let fields = req.body;
    
    let datos = {
        laboratorio:fields.laboratorio,
        pregunta:fields.pregunta,
        respuesta:fields.respuesta,          
    }
    const modelRespuesta = new Respuesta(datos);
    Respuesta.findOne({pregunta: fields.pregunta,laboratorio: fields.laboratorio}).exec()
    .then(doc=>{
        
        if (doc != null) {
            res.status(200).json({error: 'La respuesta a la pregunta dada, ya existe'});
            return false;
        }else{
            return modelRespuesta.save()
        }   
    })        
    .then(result => {
        
        if (result != false) {
            res.status(201).json({message: 'Se Agrego  Respuesta',result});
        }
    })
    .catch(err => {
        res.status(500).json({error:err.message})
    });  
});
/* listar Respuestas */
router.get('/', function (req, res) {

    Respuesta.find().populate('pregunta','-__v').select('-__v').exec()
    .then(docs => {
        if(docs.length == 0){
        return res.status(404).json({message: 'No existen Respuestas disponibles'});
        }
        res.json({
            data: docs,
            count: docs.length
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err.message
        })
    });
});
/* Listar Respuesta de un Laboratorio */
router.get('/laboratorio/:id', function (req, res, next) {
    Respuesta.find({laboratorio:req.params.id}).select('-__v').exec()
    .then(docs => {
        if(docs.length == 0){
        return res.status(404).json({message: 'No existen Respuestas registrados'});
        }
        res.json({data:docs});
    })
    .catch(err => {
        res.status(500).json({
            error: err.message
        })
    });
});



router.patch('/:id', function (req, res) {
    
    let idRespuesta = req.params.id;
    const datos = {};

    Object.keys(req.body).forEach((key) => {
      if (key != 'laboratorio' || key != 'laboratorio') {
        datos[key] = req.body[key];  
      }  
    });
    
    Respuesta.updateOne({_id: idRespuesta}, datos).exec()
        .then(result => {
            let message = 'Datos actualizados';
            if (result.ok == 0) {
                message = 'Verifique los datos, no se realizaron cambios';
            }
            if (result.ok == 1 && result.n == 0) {
                message = 'No se encontro el reRespuesta';
            }
            if (result.ok == 1 && result.n == 1 && result.nModified == 0) {
                message = 'Se recibieron los mismos datos antiguos,no se realizaron cambios';
            }
            res.json({
                message,
                result
            });
            
        }).catch(err => {
            res.status(500).json({
                error: err
            })
        });
});
// no son necesarios VVVVVVV seguridad, audi
router.delete('/:id', function (req, res) {
    let idRespuesta = req.params.id;
    Respuesta.deleteOne({_id: idRespuesta}).exec()
        .then(result => {
            let message = 'Se elimino el recurso';
            if (result.ok == 0) {
                message = 'Verifique los datos, no se realizaron cambios';
            }
            if (result.ok == 1 && result.n == 0) {
                message = 'No se encontro el recurso';
            }
            res.json({
                message,
                result
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});

module.exports = router;
