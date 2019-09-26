var express = require('express');
var router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
//const ObjectId = require('mongoose').Types.ObjectId;
const sha1 = require('sha1');

const Usuario = require('../../database/models/usuario');
const Imagen = require('../../database/models/imagen');




const storage = multer.diskStorage({
	destination: function (res, file, cb) {
		try {
			fs.statSync('./uploads/');
		} catch (e) {
			fs.mkdirSync('./uploads/');
		}
		cb(null, './uploads/');
	},
	filename: (res, file, cb) => {
		cb(null, 'IMG-' + Date.now() + path.extname(file.originalname))
	}
})
const fileFilter = (req, file, cb) => {
if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' ) {
	return cb(null, true);
}
return cb(new Error('Solo se admiten imagenes png, jpg y jpeg'));
}

const upload = multer({
storage: storage,
fileFilter: fileFilter,
limits: {
	fileSize: 1024 * 1024 * 1 
}
}).single('imagen');
/* 

*/
/* Agregar avatar a usuario */
router.post("/imagen/:id", (req, res) => {
console.log(req.body);
upload(req, res, (error) => {
	if(error){
	return res.status(500).json({
		"error" : error.message

	});
	}else{
	if (req.file == undefined) {
		return res.status(400).json({
		"error" : 'No se recibio la imagen'

		});
	}
	var img = {         
		name : req.file.originalname,
		idUsuario: req.params.id,
		path : req.file.path,
	};
	var modelImagen = new Imagen(img);
	modelImagen.save()
		.then( (result) => {
		return Usuario.findByIdAndUpdate(req.params.id,{avatar:'/api/imagenes/' + result._id}).exec()
		})
		.then(result => {
		res.status(201).json({message: 'Se Agrego la imagen correctamente',result});
		})
		.catch(err => {
		res.status(500).json({error:err.message})
		});
	}
});
});




//>>>>>>>>>>>>>>>>>>>> insecure
router.get('/', function (req, res, next) {
Usuario.find().select('-__v -password -fechaRegistro').exec().then(docs => {
	if(docs.length == 0){
		return res.status(404).json({message: 'no existen usuarios registrados'});
	}
	
	res.json(docs);
})
.catch(err => {
	res.status(500).json({
		error: err.message
	})
});
});
//<<<<<<<<<<<<<<<<<< insecure



/* Registro de usuarios */
router.post('/', function (req, res, next) {
//verificar que no exista mismo correo
Usuario.findOne({email:req.body.email})
.exec()
.then(doc => {
	if (doc != null) {
	return res.status(400).json({error:'El correo ya esta en uso'});
	}

	const datos = {
	nombre: req.body.nombre,
	email: req.body.email,
	telefono: req.body.telefono,
	ci: req.body.ci,
	rud: req.body.rud,
	tipo: req.body.tipo,//el tipo de usuario
	};
	if (req.body.password == undefined || req.body.password == '') {
	return res.status(400).json({
		error: 'Falta la contraseña'
	})
	}    
	datos.password = sha1(req.body.password);
	//console.log(datos);    
	var modelUsuario = new Usuario(datos);
	return modelUsuario.save()               
}).then((result) => {
	res.json({
		message: "Registro exitoso",
		result
	});
})
.catch(err => {
	res.status(500).json({
		error: err.message
	})
});
});
//login example
router.post('/login', (req, res, next) => {
Usuario.find({
		email: req.body.email
	})
	.exec()
	.then(user => {
		if (user.length < 1) {
			return res.status(401).json({
				message: "Usuario inexistente"
			});
		}
		if (req.body.password != user[0].password) {
			return res.status(400).json({
				message: "Fallo al autenticar, verifique los datos"
			});
		}else{
			const token = jwt.sign({
				email: user[0].email,
				userId: user[0]._id
				},
				process.env.JWT_KEY || 'secret321', {
					expiresIn: "1h"
				});
			
			return res.status(200).json({
				message: "Acceso correcto",
				tipo: user[0].tipo,
				token
			});
		}
	})
	.catch(err => {
		//console.log(err);
		res.status(500).json({
			error: err
		});
	});
});

//patch user example
router.patch('/:id', function (req, res, next) {
let idUsuario = req.params.id;
const datos = {};

Object.keys(req.body).forEach((key) => {
	if (key != 'email') {
	datos[key] = req.body[key];  
	}  
});
//console.log(datos);
Usuario.updateOne({_id: idUsuario}, datos).exec()
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

module.exports = router;