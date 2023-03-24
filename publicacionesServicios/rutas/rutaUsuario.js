const express = require('express');
const router = express.Router();

const db = require('../config/database');
const sql = require('mssql');
const User = require('../modelo/usuario');


router.get('/getGestionUsuarios/:opcion/:con1/:con2/:con3/:con4/:con5/:banCom', (req, res) => {
    const accion = req.params.opcion;
    const condi1 = req.params.con1;
    const condi2 = req.params.con2;
    const condi3 = req.params.con3;
    const condi4 = req.params.con4;
    const condi5 = req.params.con5;
    try {
        User.obtenerGestionUsuarios(accion, condi1, condi2, condi3, condi4, condi5, (err, valor) => {
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

router.post('/ingresoGestionUsuarios', function (req, res) {
    console.log(req.body[0]['dato1']);
    User.postGestionUsuarios(req.body[0]['dato1'], req.body[0]['dato2'], req.body[0]['dato3'], req.body[0]['dato4'], req.body[0]['dato5'],
        req.body[0]['dato6'], req.body[0]['dato7'], req.body[0]['dato8'], req.body[0]['dato9'], req.body[0]['dato10'], req.body[0]['dato11'],
        req.body[0]['dato12'], req.body[0]['dato13'], req.body[0]['dato14'], req.body[0]['dato15'], req.body[0]['opc'],
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