var express = require('express');
var router = express.Router();


const Curso = require('../../database/models/curso');
const Guia = require('../../database/models/guia');
const Laboratorio = require('../../database/models/laboratorio');


/* Agregar nuevo Curso */
router.post("/", (req, res) => {
        let fields = req.body;
        let datos = {
            materia:fields.materia,
            docente:fields.docente,
            gestion:fields.gestion,
            grupo:fields.grupo,
        }

        const modelCurso = new Curso(datos);
        modelCurso.save()
          
          .then(result => {
            res.status(201).json({message: 'Se Agrego el Curso',result});
          })
          .catch(err => {
            res.status(500).json({error:err.message})
          });  
});
/* listar Cursos */
router.get('/', function (req, res, next) {
    let criterios = {};
    //Cursos de un docente
    if (req.query.docente != undefined && req.query.docente != '') {
        criterios.docente = req.query.docente;
        //console.log(criterios);
    }
    Curso.find(criterios).select('-__v').populate('materia','-__v').exec().then(docs => {
        if(docs.length == 0){
        return res.status(404).json({message: 'No existen Cursos disponibles'});
        }
        res.json({data:docs});
    })
    .catch(err => {
        res.status(500).json({
            error: err.message
        })
    });
});
/* Estadisticas  */
router.get('/estadisticas', function (req, res, next) {
    let criterios = {};
    //Estadisticas de los cursos de una gestion de un docente
    if (req.query.gestion != undefined && req.query.gestion != '') {
        criterios.gestion = req.query.gestion;
        //console.log(criterios);
    }else{
        let anio = new Date().getFullYear();
        criterios.gestion = new RegExp('[0-9]{2}\/' + anio  ,'gm');
       
    }
    //Estadisticas los curso de un docente
    if (req.query.docente != undefined && req.query.docente != '') {
        criterios.docente = req.query.docente;
        //console.log(criterios);
    }
    //Estadistica de un curso
    if (req.query.curso != undefined && req.query.curso != '') {
        criterios._id = req.query.curso;  
    }
    //console.log(criterios);
    let allGuias;
    Curso.find(criterios).select('-__v').populate('materia','-__v -fechaRegistro').exec()
    .then(docs => {
        if(docs.length == 0){
            return 'curso';
            res.status(404).json({message: 'No se encontró ningun Curso'});
        }
        let cursos = [];
        for (let i = 0; i < docs.length; i++) {
            cursos.push({curso: docs[i]._id});            
        }
        return Guia.find().or(cursos).select("-contenidoHtml -fechaRegistro -__v").exec()
        res.json({data:docs});
    })
    .then(docs => {
        if (docs === 'curso') {
            return 'curso';
        }else{
            if(docs.length == 0){
                return 'guia';
            }
            let guias = [];
            for (let i = 0; i < docs.length; i++) {
                guias.push({guia: docs[i]._id});            
            }
            allGuias = docs;
            return Laboratorio.find().or(guias).exec()
            res.json({data:docs});
        }
    })
    .then(docs => {
        if (docs === 'curso') {
            return res.status(404).json({message: 'No se encontró ningun Curso'});
        }
        if (docs === 'guia') {
            return res.status(404).json({message: 'No se encontró ninguna Guía'});
        }else{
            if(docs.length == 0){
                res.status(404).json({message: 'No se encontró ningun Laboratorio'});
            }
            let guias = [];
            for (let i = 0; i < allGuias.length; i++) {
                let aux = {};
                aux._id = allGuias[i]._id;
                aux.curso = allGuias[i].curso;
                aux.numero = allGuias[i].numero;
                aux.docente = allGuias[i].docente;
                aux.labs = {name:'sdsds',oks:'asas',asq:'asas'};
                guias.push(aux);
                //allGuias[i]['preguntas'] = {name:'any name',app: 'app1'};
                //Object.assign(allGuias[i], {name:'any name',app: 'app1'})
                //console.log('ssss',allGuias[i].app);
                
            }

            let guiass = {};
            guiass.as = 'sd';
            guiass.ad = 'ad'
            
            res.json({data:docs,guias,guiass});
        }
    })
    .catch(err => {
        res.status(500).json({
            error: err.message
        })
    });
});

/* devolver un Curso */
router.get('/:id', function (req, res) {
    let criterios = {_id: req.params.id};    
    Curso.findOne(criterios).select('-__v').populate('materia','-__v').exec().then(doc => {
        if(doc == null){
            return res.status(404).json({message: 'No existe el Recurso'});
        }
        res.json(doc);
    })
    .catch(err => {
        res.status(500).json({
            error: err.message
        })
    });
});

//// no son necesarios VVVVVVV

router.patch('/:id', function (req, res) {
    let idCurso = req.params.id;
    const datos = {
        gestion:req.body.gestion
    };

    
    Curso.updateOne({_id: idCurso}, datos).exec()
        .then(result => {
            let message = 'Datos actualizados';
            if (result.ok == 0) {
                message = 'Verifique los datos, no se realizaron cambios';
            }
            if (result.ok == 1 && result.n == 0) {
                message = 'No se encontro el recurso';
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
    let idCurso = req.params.id;
    Curso.deleteOne({_id: idCurso}).exec()
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
