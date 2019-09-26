var express = require('express');
var router = express.Router();
const path = require('path');
const fs = require('fs');
const Imagen = require('../../database/models/imagen');

/*Obtener todas las imagenes */
router.get("/", (req, res) => { 
    Imagen.find().exec()
    .then(docs => {
      res.json({
        data: docs
      });
    })
    .catch(err => {
      res.status(500).json({
          error: err.message
      })
    });
  });
/*Listar imagenes del usuario */
router.get("/usuario/:id", (req, res) => { 
    Imagen.find({idUsuario:req.params.id}).exec()
    .then(docs => {
      res.json({
        data: docs
      });
    })
    .catch(err => {
      res.status(500).json({
          error: err.message
      })
    });
  });
/* Obtener imagen por url*/
router.get("/:id", (req, res) => { 
    Imagen.findOne({_id: req.params.id}).exec()
    .then(doc => {
      
      if(doc){
        //regresamos la imagen deseada
        
        var img = fs.readFileSync("./" + doc.path);
        res.contentType('image/jpeg');
        if (path.extname(doc.path) == '.png') {
          res.contentType('image/png');
        }
        res.status(200).send(img);
        //regresamos la imagen deseada
      }
      else{
        res.status(424).json({
          "error": "La solicitud falló, ,la imagen fue eliminada"
        });
        return;
      }
    })
    .catch(err => {
      res.status(500).json({
          error: err.message
      })
    });
  });

module.exports = router;