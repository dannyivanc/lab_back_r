var express = require('express');
var router = express.Router();

const Integrante = require('../../database/models/integrante');
const Laboratorio = require('../../database/models/laboratorio');
const Usuario = require('../../database/models/usuario');
const Curso = require('../../database/models/curso');


/* Agregar nuevo Integrante */
router.post("/", (req, res) => {
    let fields = req.body;
    let datos = {
        curso:fields.curso,
        estudiante:fields.estudiante,           
        gestion:fields.gestion//??
    }

    const modelIntegrante = new Integrante(datos);
    modelIntegrante.save()
        
        .then(result => {
        res.status(201).json({message: 'Se Agrego  Integrante',result});
        })
        .catch(err => {
        res.status(500).json({error:err.message})
        });  
});


/* listar Integrantes */
router.get('/', function (req, res, next) {
    criterios = {};

    /* LIstar Integrantes de un Curso */
    if (req.query.curso != undefined) {
        criterios.curso = req.query.curso
    }
    /* LIstar Integrantes de todos los Cursos de un docente 
    if (req.query.docente != undefined) {
        criterios.docente = req.query.docente

    }*/

    Integrante.find(criterios).populate('estudiante', '-password -__v -tipo').select('-__v').exec().then(docs => {
        if(docs.length == 0){
            return res.status(404).json({message: 'No existen Integrantes disponibles'});
        }
        res.json({data:docs});
    })
    .catch(err => {
        res.status(500).json({
            error: err.message
        })
    });
});

/* listar Integrantes de todas los cursos de un docente*/
router.get('/docentes/:id', function (req, res) {
    
    let docente  = req.params.id;
   //console.log('docente',docente);
    let cursos = [];

    
    Curso.find({docente:docente}).exec()
    .then(docs => {
        if (docs.length > 0) {
            for (let i = 0; i < docs.length; i++) {
                cursos.push({curso: docs[i]._id});                
            }
            //console.log(cursos);
            return Integrante.find().or(cursos).select('-__v -fechaRegistro').populate('estudiante','-__v -password -tipo -telefono -archivosCompartidos -fechaRegistro')
                .populate({
                    path: 'curso',
                    select: '-__v -docente -gestion -fechaRegistro',
                    populate: { 
                        path: 'materia',
                        select: '-__v -fechaRegistro',
                    }
                  }).exec()
        }else{
            return false;
        }
    })
    .then(docs => {
        if (docs === false) {
            return res.status(404).json({message: 'No se encontro ningun curso'});
        }else{
            if(docs.length == 0){
                return res.status(404).json({message: 'No existen Integrantes de ningun curso registrados'});
            }
            //console.log(docs);
            res.json({data:docs,count:docs.length});
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err.message
        })
    })

    /* Integrante.find(criterios).populate('estudiante', '-password -__v -tipo').select('-__v').exec().then(docs => {
        if(docs.length == 0){
            return res.status(404).json({message: 'No existen Integrantes disponibles'});
        }
        res.json({data:docs});
    })
    .catch(err => {
        res.status(500).json({
            error: err.message
        })
    }); */
});


// Informacion del estudiante y sus laboratorios
router.get('/:id', function (req, res) {
    let usuario = {};
    Usuario.findOne({_id: req.params.id}).select('-__v -password -fechaRegistro').exec()
    .then(doc => {
        //console.log(doc);
        if(doc == null){
            
            return false;//
        }else {
            usuario = doc;
            return Laboratorio.find({estudiante: req.params.id}).select('-__v').populate('guia').exec();
        }   
    })
    .then(docs => {
        //console.log(usuario,docs.length);
        if (docs === false) {
            return res.status(404).json({messageU: 'No se encontro el usuario'});
        }else{
            if(docs.length == 0){
                return res.status(404).json({messageL: 'No existen Laboratorios registrados',usuario});
            }
            //console.log(docs[0].fechaRegistro.getDate() );
            res.json({data:docs,usuario});
        } 
    })
    .catch(err => {
        res.status(500).json({
            error: err.message
        })
    });
});



router.patch('/:id', function (req, res) {
    let idIntegrante = req.params.id;
    const datos = {//solo se puede actualizar la nota ??
        nota:req.body.nota
    };

    
    Integrante.updateOne({_id: idIntegrante}, datos).exec()
        .then(result => {
            let message = 'Datos actualizados';
            if (result.ok == 0) {
                message = 'Verifique los datos, no se realizaron cambios';
            }
            if (result.ok == 1 && result.n == 0) {
                message = 'No se encontro el reIntegrante';
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
//// no son necesarios VVVVVVV seguridad, audi
router.delete('/:id', function (req, res) {
    let idIntegrante = req.params.id;
    Integrante.deleteOne({_id: idIntegrante}).exec()
        .then(result => {
            let message = 'Se elimino el reIntegrante';
            if (result.ok == 0) {
                message = 'Verifique los datos, no se realizaron cambios';
            }
            if (result.ok == 1 && result.n == 0) {
                message = 'No se encontro el reIntegrante';
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
