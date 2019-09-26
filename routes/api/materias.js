var express = require('express');
var router = express.Router();


const Materia = require('../../database/models/materia');


/* Agregar nueva Materia */
router.post("/", (req, res) => {
        let fields = req.body;
        let datos = {
            nombre:fields.nombre,
            sigla:fields.sigla,
            nivel:fields.nivel
        }

        const modelMateria = new Materia(datos);
        modelMateria.save()
          
          .then(result => {
            res.status(201).json({message: 'Se Agrego Materia',result});
          })
          .catch(err => {
            res.status(500).json({error:err.message})
          });  
});
/* listar Materias */
router.get('/', function (req, res, next) {

    
    Materia.find().select('-__v').exec().then(docs => {
        if(docs.length == 0){
        return res.status(404).json({message: 'No existen Materias disponibles'});
        }
        res.json({data:docs});
    })
    .catch(err => {
        res.status(500).json({
            error: err.message
        })
    });
});
/* LIstar Materias de un docente */
router.get('/docente/:id', function (req, res, next) {
    Materia.find({docente:req.params.id}).select('-__v').exec().then(docs => {
        if(docs.length == 0){
        return res.status(404).json({message: 'No existen Materias registrados'});
        }
        res.json({data:docs});
    })
    .catch(err => {
        res.status(500).json({
            error: err.message
        })
    });
});

//// no son necesarios VVVVVVV

router.patch('/:id', function (req, res) {
    let idMateria = req.params.id;
    const datos = {
        gestion:req.body.gestion
    };    
    Materia.updateOne({_id: idMateria}, datos).exec()
        .then(result => {
            let message = 'Datos actualizados';
            if (result.ok == 0) {
                message = 'Verifique los datos, no se realizaron cambios';
            }
            if (result.ok == 1 && result.n == 0) {
                message = 'No se encontro el reMateria';
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

router.delete('/:id', function (req, res) {
    let idMateria = req.params.id;
    Materia.deleteOne({_id: idMateria}).exec()
        .then(result => {
            let message = 'Se elimino Materia';
            if (result.ok == 0) {
                message = 'Verifique los datos, no se realizaron cambios';
            }
            if (result.ok == 1 && result.n == 0) {
                message = 'No se encontro el reMateria';
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
