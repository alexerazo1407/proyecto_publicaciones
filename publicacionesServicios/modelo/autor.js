const db = require('../config/database');
const sql = require('mssql');


module.exports.obtenerGestionAutor = function (opcion, param1, callback) {
    var conn = new sql.ConnectionPool(db);
    var req = new sql.Request(conn);
    var sentencia;
    if (opcion == 1)//OBTIENE ROLES 
        sentencia = "SELECT strNombreArticulo, intProcedencia, dateFechaPublicacion, bitfilial ,ea.intEstado"
       +" FROM tblPersona JOIN tblPersonaArticulo as ea ON ea.intPersona = tblPersona.intIdPersona "
       +" JOIN tblArticulo as a ON a.intIdArticulo = ea.intArticulo"
       +" WHERE tblPersona.intIdPersona = '3276' ";
    if (opcion == 2)// OBTENER LOS USUARIOS REGISTRADOS 
        sentencia = "SELECT intIdPersona, strCedula, strNombres, strApellidos, strCorreo, strTelefono, strCargo, bitNombramiento, "
        +"strDependencia, intEstado, IIF(intEstado = 1, 'Activo', 'No Activo') AS detalleEstado, IIF(intEstado = 1, 'btnActivo', 'btnNoActivo') AS claseActivo "
        +"FROM tblPersona";
        if (opcion == 3)// OBTENER LOS USUARIOS REGISTRADOS 
        sentencia = "SELECT intIdPersona, strCedula, strNombres, strApellidos, strCorreo, strTelefono, strCargo, bitNombramiento, "
        +"strDependencia, intEstado, IIF(intEstado = 1, 'Activo', 'No Activo') AS detalleEstado, IIF(intEstado = 1, 'btnActivo', 'btnNoActivo') AS claseActivo "
        +"FROM tblPersona";



    conn.connect()
        .then(() => {
            req.query(sentencia, (err, recordset) => {
                if (err) {
                    console.error('Fallo en la Consulta', err.stack)
                } else {
                    callback(null, recordset);
                }
                conn.close();
            })
        })
        .catch((err) => {
            console.log('Error: ' + err.stack);
        });
}

module.exports.postGestionUsuarios = function (dato1, dato2, dato3, dato4, dato5, dato6, dato7, dato8, dato9, dato10, opcion, Callback) {
    var sentencia;
    if (opcion == 1)
        sentencia = "INSERT INTO tblPersona (intIdPersona, strCedula, strNombres, strApellidos, strCorreo, strTelefono, strCargo, bitNombramiento,"
            + "strDependencia, intEstado) VALUES (" + dato1 + ", '" + dato2 + "', '" + dato3 + "', '" + dato4 + "', '" + dato5 + "', '" + dato6
            + "', '" + dato7 + "', " + dato8 + ", '" + dato9 + "', " + dato10 + ")";
    if (opcion == 2)
        sentencia = "UPDATE tblPersona SET strCedula='" + dato2 + "', strNombres='" + dato3 + "', strApellidos='" + dato4
            + "', strCorreo='" + dato5 + "', strTelefono='" + dato6 + "', strCargo='" + dato7 + "', bitNombramiento='" + dato8 + "',"
            + "strDependencia='" + dato9 + "', intEstado=" + dato10 + " WHERE (intIdPersona = " + dato1 + ")";

    if (opcion == 3)
            sentencia = "UPDATE tblPersona SET strCedula='" + dato2 + "', strNombres='" + dato3 + "', strApellidos='" + dato4
                + "', strCorreo='" + dato5 + "', strTelefono='" + dato6 + "', strCargo='" + dato7 + "', bitNombramiento='" + dato8 + "',"
                + "strDependencia='" + dato9 + "', intEstado=" + dato10 + " WHERE (intIdPersona = " + dato1 + ")";    
                
    if (opcion == 4)
                sentencia = "INSERT INTO tblRol (strNombre, strDescripcion, strIcono, intEstado) VALUES (" 
                +" '" + dato2 + "', '" + dato3 + "', '" + dato4 + "', " + dato5 + ")";
console.log(sentencia)
    sql.connect(db, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query(sentencia, function (err, recorset) {
            if (err) Callback("false");
            else Callback("true");
            sql.close();
        });
    });
}

module.exports.cargaimagen = function (req, res) {
    fileUploadService.fileUpload(req, res)
        .then(fileUploadServiceResponse => {
            res.status(200).send(fileUploadServiceResponse)
        })
        .catch(error => {
            res.status(400).send(error)
        })
}