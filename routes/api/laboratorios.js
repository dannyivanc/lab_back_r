var express = require('express');
var router = express.Router();


const Laboratorio = require('../../database/models/laboratorio');
const Respuesta = require('../../database/models/respuesta');


/* Agregar nuevo Laboratorio */
router.post("/", (req, res) => {
        let fields = req.body;
        let datos = {
            guia:fields.guia,
            estudiante:fields.estudiante,
        }
        if(fields.tiempo != undefined){
            datos.tiempo = fields.tiempo
        }
        const modelLaboratorio = new Laboratorio(datos);
        modelLaboratorio.save()
          
          .then(result => {
            res.status(201).json({message: 'Se Agrego  Laboratorio',result});
          })
          .catch(err => {
            res.status(500).json({error:err.message})
          });  
});
/* listar Laboratorios */
router.get('/', function (req, res, next) {

    Laboratorio.find().select('-__v').exec().then(docs => {
        if(docs.length == 0){
            return res.status(404).json({message: 'No existen Laboratorios disponibles'});
        }
        res.json({data:docs});
    })
    .catch(err => {
        res.status(500).json({
            error: err.message
        })
    });
});

/* LIstar Laboratorios de un estudiante */
router.get('/estudiantes/:id', function (req, res) {
    Laboratorio.find({estudiante:req.params.id}).select('-__v').exec().then(docs => {
        if(docs.length == 0){
        return res.status(404).json({message: 'No existen Laboratorios registrados'});
        }
        res.json({data:docs});
    })
    .catch(err => {
        res.status(500).json({
            error: err.message
        })
    });
});

router.get('/:id', function (req, res) {
    
	let laboratorio = {};
	
	Laboratorio.findOne({_id: req.params.id}).select('-__v ')
	.populate({
		path: 'guia',
		select: '-__v',
		populate: { 
			path: 'curso',
			select: '-__v',
			populate: {path: 'materia',select:'-__v'}
		}
	  })
	.populate('estudiante','-__v -password').exec()
	.then(doc => {
		if(doc == null){
			return false;//
		}else {
			laboratorio = doc;
			return Respuesta.find({laboratorio: req.params.id}).select('-__v').populate('pregunta','-__v').exec();
		}   
	})
	.then(docs => {
		//console.log(laboratorio);
		if (docs != false) {
			if(docs.length == 0){
				return res.status(404).json({messageR: 'No se encontro el recurso',laboratorio});
			}
			res.json({data:docs,laboratorio});
		}else{
			return res.status(404).json({messageL: 'No se encontro el laboratorio'});
		} 
	})
	.catch(err => {
		res.status(500).json({
			error: err.message
		})
	});
});

	



router.patch('/:id', function (req, res) {
    let idLaboratorio = req.params.id;
    const datos = {};

    Object.keys(req.body).forEach((key) => {
      if (key != 'guia' ||key != 'estudiante'  ) {
        datos[key] = req.body[key];  
      }  
    });
    Laboratorio.updateOne({_id: idLaboratorio}, datos).exec()
        .then(result => {
            let message = 'Datos actualizados';
            if (result.ok == 0) {
                message = 'Verifique los datos, no se realizaron cambios';
            }
            if (result.ok == 1 && result.n == 0) {
                message = 'No se encontro el Laboratorio';
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
// no son necesarios  seguridad, audi
router.delete('/:id', function (req, res) {
    let idLaboratorio = req.params.id;
    Laboratorio.deleteOne({_id: idLaboratorio}).exec()
        .then(result => {
            let message = 'Se elimino el reLaboratorio';
            if (result.ok == 0) {
                message = 'Verifique los datos, no se realizaron cambios';
            }
            if (result.ok == 1 && result.n == 0) {
                message = 'No se encontro el reLaboratorio';
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
