var express = require('express');
var router = express.Router();


const Pregunta = require('../../database/models/pregunta');


/* Agregar nuevo Pregunta */
router.post("/", (req, res) => {
        let fields = req.body;
        let datos = {
            guia:fields.guia,
            tipo:fields.tipo,
            input:fields.input,
            label:fields.label,
            respuesta:fields.respuesta,
            valorS100:fields.valorS100,            
        }
        const modelPregunta = new Pregunta(datos);
        modelPregunta.save()
          
          .then(result => {
            res.status(201).json({message: 'Se Agrego la Pregunta',result});
          })
          .catch(err => {
            res.status(500).json({error:err.message})
          });  
});
/* listar Preguntas */
router.get('/', function (req, res, next) {

    Pregunta.find().select('-__v').exec().then(docs => {
        if(docs.length == 0){
            return res.status(404).json({message: 'No existen Preguntas disponibles'});
        }
        res.json({data:docs});
    })
    .catch(err => {
        res.status(500).json({
            error: err.message
        })
    });
});
/* LIstar Preguntas de una guia */
router.get('/guia/:id', function (req, res, next) {
    Pregunta.find({guia:req.params.id}).select('-__v').exec().then(docs => {
        if(docs.length == 0){
        return res.status(404).json({message: 'No existen Preguntas registrados'});
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
    let idPregunta = req.params.id;
    const datos = {};

    Object.keys(req.body).forEach((key) => {
      if (key != 'guia'   ) {
        datos[key] = req.body[key];  
      }  
    });
    Pregunta.updateOne({_id: idPregunta}, datos).exec()
        .then(result => {
            let message = 'Datos actualizados';
            if (result.ok == 0) {
                message = 'Verifique los datos, no se realizaron cambios';
            }
            if (result.ok == 1 && result.n == 0) {
                message = 'No se encontro el rePregunta';
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
    let idPregunta = req.params.id;
    Pregunta.deleteOne({_id: idPregunta}).exec()
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
