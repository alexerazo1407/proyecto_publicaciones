const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config/database');
const dbMaster = require('./config/baseMaster');
const app = express();
const sql = require('mssql');
const users = require('./rutas/rutaUsuario');
const central = require('./rutas/rutaCentral');
const master = require('./rutas/rutaMaster');

var fs = require('fs');
var http = require('http');
var https = require('https');

//CONECION A LA BASE DE DATOS DE PUBLICACIONES
var connection = new sql.ConnectionPool(config);
connection.connect(function (err) {
    if (err) {
        console.error('Error en la Conexion de la Base de Datos', err.stack)
    } else {
        console.log('Conexion Base de Datos PUBLICACIONES')
    }
});
//CONECION A LA BASE DE DATOS MASTER
var connectMaster = new sql.ConnectionPool(dbMaster);
connectMaster.connect(function (err) {
    if (err) {
        console.error('Error en la Conexion de la Base de Datos', err.stack)
    } else {
        console.log('Conexion Base de Datos MASTER')
    }
});


//Port Number
const port = 3031;
//const port = process.env.PORT||8080;

//Cors Middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


//Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));//

app.use('/rutaswPublicaciones', users);
app.use('/rutaPublicacionesCentral', central);
app.use('/rutaPublicacionesMaster', master);
///app.use('/Seguridad', Seguridad);

//Index Router
app.get('/', (req, res) => {
    res.send('Invalid Endpoint');
});

var options = {
    key: fs.readFileSync('Certificados/espoch_comodo_key_2018.key'),
    cert: fs.readFileSync('Certificados/STAR_espoch_edu_ec.crt'),
    ca: fs.readFileSync('Certificados/STAR_espoch_edu_ec.crt')
};

app.use(function (req, resp, next) {

    return resp.redirect(301, 'https://' + req.headers.host + '/');

    // if (req.headers['x-forwarded-proto'] == 'http') {
    //     return resp.redirect(301, 'https://aerazo.espoch.edu.ec/');
    //     //return resp.redirect(301, 'https://' + req.headers.host + '/');
    // } else {
    //     return resp.redirect(301, 'https://aerazo.espoch.edu.ec/');
    // }
});

http.createServer(app).listen(3030)
https.createServer(options, app).listen(port);