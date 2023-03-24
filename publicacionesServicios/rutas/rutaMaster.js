const express = require('express');
const router = express.Router();

const db = require('../config/baseMaster');
const sql = require('mssql');
const User = require('../modelo/master');


router.get('/getInformacionCarreras/:opcion/:con1/:con2/:con3/:banCom', (req, res) => {
    const accion = req.params.opcion;
    const condi1 = req.params.con1;
    const condi2 = req.params.con2;
    const condi3 = req.params.con3;
    try {
        User.obtenerInformacionCarreras(accion, condi1, condi2, condi3, (err, consulta) => {
            if (consulta.recordset.length == 0) {
                return res.json({
                    success: false,
                });
            } else {
                res.json({
                    success: true,
                    carrera: consulta.recordset
                });
            }
        });
    } catch (err) {
        console.log('Error: ' + err)
    }
});
router.get('/getInformacionMatricula/:opcion/:carrera/:con1/:con2/:con3/:banCom', (req, res) => {
    const accion = req.params.opcion;
    const mallac = req.params.carrera;
    const condi1 = req.params.con1;
    const condi2 = req.params.con2;
    const condi3 = req.params.con3;
    try {
        User.obtenerInformacionMatricula(accion, mallac, condi1, condi2, condi3, (err, consulta) => {
            if (consulta.recordset.length == 0) {
                return res.json({
                    success: false,
                });
            } else {
                res.json({
                    success: true,
                    matricula: consulta.recordset
                });
            }
        });
    } catch (err) {
        console.log('Error: ' + err)
    }
});
router.get('/getInformacionPersona/:opcion/:con1/:con2/:con3/:banCom', (req, res) => {
    const accion = req.params.opcion;
    const condi1 = req.params.con1;
    const condi2 = req.params.con2;
    const condi3 = req.params.con3;
    try {
        User.obtenerInformacionPersona(accion, condi1, condi2, condi3, (err, consulta) => {
            if (consulta.recordset.length == 0) {
                return res.json({
                    success: false,
                });
            } else {
                res.json({
                    success: true,
                    persona: consulta.recordset
                });
            }
        });
    } catch (err) {
        console.log('Error: ' + err)
    }
});


module.exports = router;