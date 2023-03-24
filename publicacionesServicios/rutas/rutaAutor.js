const express = require('express');
const router = express.Router();

const db = require('../config/database');
const sql = require('mssql');
const User = require('../modelo/autor');


router.get('/getGestionAutor/:opcion/:con1/:banCom', (req, res) => {
    const accion = req.params.opcion;
    const condi1 = req.params.con1;
    try {
        User.obtenerGestionAutor(accion, condi1, (err, valor) => {
            if (valor.recordset.length == 0) {
                return res.json({
                    success: false,
                });
            } else {
                res.json({
                    success: true,
                    usuario: valor.recordset
                });
            }
        });
    } catch (err) {
        console.log('Error: ' + err)
    }
});

router.post('/ingresoGestionAutor', function (req, res) {console.log(req.body[0]['dato1']);
    User.postGestionUsuarios(req.body[0]['dato1'], req.body[0]['dato2'], req.body[0]['dato3'], req.body[0]['dato4'], req.body[0]['dato5'],
     req.body[0]['dato6'], req.body[0]['dato7'], req.body[0]['dato8'], req.body[0]['dato9'], req.body[0]['dato10'], req.body[0]['opc'],
     function (data) {
        res.json({ consulta: data });
    });
});



router.post('/subeImage', function (req, res) {
    User.cargaimagen(req.body.consulta, function (data) {
        res.json({ visita: data });
    });
});

module.exports = router;