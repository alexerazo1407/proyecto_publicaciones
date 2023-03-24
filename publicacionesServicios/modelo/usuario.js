const db = require('../config/database');
const sql = require('mssql');
const { param } = require('../rutas/rutaUsuario');


module.exports.obtenerGestionUsuarios = function (opcion, param1, param2, param3, param4, param5, callback) {
    var conn = new sql.ConnectionPool(db);
    var req = new sql.Request(conn);
    var sentencia;
    if (opcion == 1)//OBTIENE ROLES 
        sentencia = "SELECT intIdRol, strNombre, strDescripcion, strIcono, intEstado, IIF(intEstado = 1, 'Activo', 'No Activo') AS detalleEstado, IIF(intEstado = 1, 'btnActivo', 'btnNoActivo') AS claseActivo FROM tblRol";
    if (opcion == 2)// OBTENER LOS USUARIOS REGISTRADOS 
        sentencia = "SELECT intIdPersona, strCedula, strNombres, strApellidos, strCorreo, strTelefono, strCargo, bitNombramiento,"
            + " strDependencia, intEstado, IIF(intEstado = 1, 'Activo', 'No Activo') AS detalleEstado, IIF(intEstado = 1, 'btnActivo', 'btnNoActivo') AS claseActivo, "
            + " IIF(bitNombramiento = 1, 'Si', 'No') AS detalleNombra, IIF(bitNombramiento = 1, 'btnSiNombra', 'btnNoNombra') AS claseNombra FROM tblPersona ";

    if (opcion == 3)//OBTIENE articulos de un autor 
        sentencia = `SELECT tblPersonaArticulo.intArticulo, tblPersonaArticulo.intPersona, tblPersonaArticulo.bitFilial, tblPersonaArticulo.bitPertinencia, tblPersonaArticulo.intEstado, tblPersonaArticulo.distributivo, tblArticulo.intIdArticulo, 
        tblArticulo.strCodigoArticulo, tblArticulo.strNombreArticulo, tblArticulo.strDescripcion, tblArticulo.intCampo, tblArticulo.intLineasInvestigacion, tblArticulo.intProcedencia, tblArticulo.dateFechaPublicacion, tblArticulo.bitComision, 
        tblArticulo.intEstado AS estadoArticulo, tblArticulo.registro, tblArticuloRegCient.textCartadeAceptacion AS ruta1, '' AS ruta2, '' AS ruta3, '1' AS tipoPublica, tblArticuloRegCient.intEstado AS estadoPublica, tblPersona.strCedula, 
        tblPersona.strNombres, tblPersona.strApellidos, tblPersona.strCorreo, tblPersona.bitNombramiento, tblPersona.strDependencia
        FROM tblArticuloRegCient INNER JOIN tblArticulo ON tblArticuloRegCient.intArticulo = tblArticulo.intIdArticulo INNER JOIN tblPersonaArticulo ON tblArticulo.intIdArticulo = tblPersonaArticulo.intArticulo
        INNER JOIN tblPersona ON tblPersonaArticulo.intPersona = tblPersona.intIdPersona WHERE (tblPersonaArticulo.intEstado = 2) OR (tblPersonaArticulo.intEstado = 3)
        UNION
        SELECT tblPersonaArticulo.intArticulo, tblPersonaArticulo.intPersona, tblPersonaArticulo.bitFilial, tblPersonaArticulo.bitPertinencia, tblPersonaArticulo.intEstado, tblPersonaArticulo.distributivo, tblArticulo.intIdArticulo, 
        tblArticulo.strCodigoArticulo, tblArticulo.strNombreArticulo, tblArticulo.strDescripcion, tblArticulo.intCampo, tblArticulo.intLineasInvestigacion, tblArticulo.intProcedencia, tblArticulo.dateFechaPublicacion, tblArticulo.bitComision, 
        tblArticulo.intEstado AS estadoArticulo, tblArticulo.registro, tblArticuloCongreso.textLibrodeMemoria AS ruta1, tblArticuloCongreso.textCartadeAceptacion AS ruta2, tblArticuloCongreso.textCertificadoPonente AS ruta3, 
        '2' AS tipoPublica, tblArticuloCongreso.intEstado AS estadoPublica, tblPersona.strCedula, tblPersona.strNombres, tblPersona.strApellidos, tblPersona.strCorreo, tblPersona.bitNombramiento, tblPersona.strDependencia
        FROM tblArticulo INNER JOIN tblPersonaArticulo ON tblArticulo.intIdArticulo = tblPersonaArticulo.intArticulo INNER JOIN tblArticuloCongreso ON tblArticulo.intIdArticulo = tblArticuloCongreso.intArticulo INNER JOIN
        tblPersona ON tblPersonaArticulo.intPersona = tblPersona.intIdPersona WHERE (tblPersonaArticulo.intEstado = 2) OR (tblPersonaArticulo.intEstado = 3)
        UNION
        SELECT tblPersonaArticulo.intArticulo, tblPersonaArticulo.intPersona, tblPersonaArticulo.bitFilial, tblPersonaArticulo.bitPertinencia, tblPersonaArticulo.intEstado, tblPersonaArticulo.distributivo, tblArticulo.intIdArticulo, 
        tblArticulo.strCodigoArticulo, tblArticulo.strNombreArticulo, tblArticulo.strDescripcion, tblArticulo.intCampo, tblArticulo.intLineasInvestigacion, tblArticulo.intProcedencia, tblArticulo.dateFechaPublicacion, tblArticulo.bitComision, 
        tblArticulo.intEstado AS estadoArticulo, tblArticulo.registro, tblLibro.textLibro AS ruta1, '' AS ruta2, '' AS ruta3, '3' AS tipoPublica, '1' AS estadoPublica, tblPersona.strCedula, tblPersona.strNombres, tblPersona.strApellidos, 
        tblPersona.strCorreo, tblPersona.bitNombramiento, tblPersona.strDependencia FROM tblArticulo INNER JOIN tblPersonaArticulo ON tblArticulo.intIdArticulo = tblPersonaArticulo.intArticulo INNER JOIN
        tblLibro ON tblArticulo.intIdArticulo = tblLibro.intArticulo INNER JOIN tblPersona ON tblPersonaArticulo.intPersona = tblPersona.intIdPersona
        WHERE (tblPersonaArticulo.intEstado = 2) OR (tblPersonaArticulo.intEstado = 3)`;

    if (opcion == 4)//OBTIENE articulos solicitudes
        sentencia = "SELECT strNombreArticulo, intProcedencia, dateFechaPublicacion, bitfilial ,ea.intEstado, ea.intEstado, a.intEstado, strDescripcion"
            + " FROM tblPersona JOIN tblPersonaArticulo as ea ON ea.intPersona = tblPersona.intIdPersona JOIN tblArticulo as a ON a.intIdArticulo = ea.intArticulo"
            + " WHERE tblPersona.intIdPersona = '" + param1 + "' AND  a.intEstado='2' ";

    if (opcion == 5)//OBTIENE articulos 
        sentencia = "SELECT  strCodigoArticulo, strNombreArticulo , dateFechaPublicacion, a.intEstado, r.strNombre, bd.strNombre"
            + " FROM tblPersona JOIN tblPersonaArticulo as ea ON ea.intPersona = tblPersona.intIdPersona JOIN tblArticulo as a ON a.intIdArticulo = ea.intArticulo"
            + " JOIN tblArticuloRegCient as ac on ac.intArticulo=a.intIdArticulo"
            + "  JOIN tblRevista as r on r.intIdRevista= ac.intRevista"
            + " JOIN tblBasedeDatos as bd on bd.intIdBasedeDatos=r.intIdRevista"
            + " JOIN tblTipoObra as ot on ot.intIdTipoObra= ac.intTipoObra"
            + " WHERE tblPersona.intIdPersona = '" + param1 + "' AND  a.intEstado='1' AND ac.intTipoObra='2'";

    if (opcion == 6)//OBTEMNER LOS ROLES DADO UN USUARIO
        sentencia = "SELECT  tblPersona.intIdPersona, tblPersona.strCedula, tblPersona.strNombres, tblPersona.strApellidos, "
            + "tblPersona.intEstado, tblRol.intIdRol, tblRol.strNombre, tblPersonaRol.intEstado AS estadoAsinaRol, tblPersona.bitNombramiento "
            + "FROM tblPersona INNER JOIN tblPersonaRol ON tblPersona.intIdPersona = tblPersonaRol.intPersosa INNER JOIN "
            + "tblRol ON tblPersonaRol.intRol = tblRol.intIdRol WHERE  (tblPersonaRol.intEstado = 1) AND (tblPersona.strCedula = '" + param1 + "')";
    if (opcion == 7)//OBTIENE ROLES ACTIVOS
        sentencia = "SELECT intIdRol, strNombre, strDescripcion, strIcono, intEstado FROM tblRol WHERE intEstado = 1";
    if (opcion == 8)//OBTIENE ROLES ASIGNADOS A UN USUARIO
        sentencia = "SELECT  tblPersona.intIdPersona, tblPersona.strCedula, tblPersona.strNombres, tblPersona.strApellidos, tblPersona.intEstado, tblRol.intIdRol, "
            + "tblRol.strNombre, tblPersonaRol.intEstado AS estadoAsinaRol FROM tblPersona INNER JOIN tblPersonaRol ON tblPersona.intIdPersona = tblPersonaRol.intPersosa INNER JOIN "
            + "tblRol ON tblPersonaRol.intRol = tblRol.intIdRol WHERE  (tblPersona.intIdPersona = " + param1 + ") OR (tblPersona.strCedula = '" + param1 + "')";
    if (opcion == 9)
        sentencia = "SELECT tblPersona.intIdPersona, tblPersona.strCedula, tblPersona.strNombres, tblPersona.strApellidos, tblPersona.strCorreo, tblRol.intIdRol, "
            + "tblRol.strNombre, tblPersonaRol.intEstado, IIF(tblPersonaRol.intEstado = 1, 'Activo','No_Activo') AS estadoRol FROM tblPersonaRol INNER JOIN tblRol ON "
            + "tblPersonaRol.intRol = tblRol.intIdRol INNER JOIN tblPersona ON tblPersonaRol.intPersosa = tblPersona.intIdPersona";
    if (opcion == 10)//PADRE OPCION O ACTIVIDADES
        sentencia = "SELECT intIdPadreOpcion, strNombre, intEstado, strIcono, tipo, IIF(intEstado = 1, 'Activo','No Activo') AS estadoRol FROM tblPadreOpcion";
    if (opcion == 11)//PERMISOS DEL SISTEMA
        sentencia = "SELECT intIdOpcion, strNombre, strDescripcion, strUrl, strMetodo, intEstado, strIcono, IIF(intEstado = 1, 'Activo','No Activo') AS estadoPermiso FROM tblOpciones";
    if (opcion == 12)//RECURSOS PADRE OPCION
        sentencia = "SELECT tblPadreOpcion.intIdPadreOpcion AS idPadre, tblPadreOpcion.strNombre AS nombPadre, tblOpciones.intIdOpcion AS idOpcion, tblOpciones.strNombre AS "
            + "nombOpcion, tblRolOpcion.bitInsertar AS insertar, tblRolOpcion.bitModificar AS editar, tblRolOpcion.bitEliminar AS borrar, tblRolOpcion.intEstado AS estadoOpcPadre, "
            + "tblRol.intIdRol AS idRol, tblRol.strNombre AS nombRol, IIF(tblRolOpcion.intEstado = 1, 'Activo', 'No Activo') AS estadoRol, "
            + "IIF(tblRolOpcion.bitInsertar = 'true', 'SI', 'NO') AS datoInsertar, "
            + "IIF(tblRolOpcion.bitModificar = 'true', 'SI', 'NO') AS datoEditar, "
            + "IIF(tblRolOpcion.bitEliminar = 'true', 'SI', 'NO') AS datoBorrar "
            + "FROM tblRolOpcion INNER JOIN tblPadreOpcion ON tblRolOpcion.intPadreOpcion = tblPadreOpcion.intIdPadreOpcion INNER JOIN "
            + "tblOpciones ON tblRolOpcion.intOpcion = tblOpciones.intIdOpcion INNER JOIN tblRol ON tblRolOpcion.intRol = tblRol.intIdRol";
    if (opcion == 13)//PROCEDENCIA DE LOS ARTICULOS 
        sentencia = "SELECT intIdProcedencia, strNombre, strDescripcion, intEstado FROM     tblProdecencia";

    if (opcion == 14) //RECURSOS PADRE OPCION
        sentencia = "SELECT DISTINCT tblPadreOpcion.intIdPadreOpcion, tblPadreOpcion.strNombre, tblPadreOpcion.intEstado, tblRolOpcion.intRol, "
            + "tblRol.strNombre AS nomRol FROM tblPadreOpcion INNER JOIN tblRolOpcion ON tblPadreOpcion.intIdPadreOpcion = tblRolOpcion.intPadreOpcion "
            + "INNER JOIN tblRol ON tblRolOpcion.intRol = tblRol.intIdRol WHERE  (tblRolOpcion.intRol = " + param1 + ")";
    if (opcion == 15) //RECURSOS PADRE OPCION
        sentencia = "SELECT DISTINCT tblPadreOpcion.intIdPadreOpcion, tblPadreOpcion.strNombre, tblPadreOpcion.intEstado, tblRolOpcion.intRol, "
            + "tblOpciones.intIdOpcion, tblOpciones.strNombre AS nombOpcion, tblRolOpcion.bitInsertar, tblRolOpcion.bitModificar, tblRolOpcion.bitEliminar, "
            + "tblRolOpcion.intEstado AS estAsigna, tblOpciones.strUrl FROM tblPadreOpcion INNER JOIN tblRolOpcion ON tblPadreOpcion.intIdPadreOpcion = tblRolOpcion.intPadreOpcion "
            + "INNER JOIN tblOpciones ON tblRolOpcion.intOpcion = tblOpciones.intIdOpcion WHERE(tblRolOpcion.intRol = " + param1 + ") AND(tblRolOpcion.intEstado = 1)";
    if (opcion == 16) //CERTIFICADOS PARA DOCENTES DE CONTRATO
        sentencia = "SELECT intIdTipoCertificado, strNombres, strDescripcion, intEstado "
            + " FROM tblTipoCertificado WHERE  (intIdTipoCertificado = 2) OR (intIdTipoCertificado = 3) OR (intIdTipoCertificado = 4)";
    if (opcion == 17)  //CERTIFICADOS PARA DOCENTES DE NOMBRAMIENTO
        sentencia = "SELECT intIdTipoCertificado, strNombres, strDescripcion, intEstado FROM     tblTipoCertificado "
            + " WHERE  (intIdTipoCertificado = 1) OR (intIdTipoCertificado = 3) OR (intIdTipoCertificado = 4)";
    if (opcion == 18)//VISTA DE PDF PERFIL AUTOR (TRES TIPOS DE PUBLICACIONES)
        sentencia = `SELECT tblPersonaArticulo.intArticulo, tblPersonaArticulo.intPersona, tblPersonaArticulo.bitFilial, tblPersonaArticulo.bitPertinencia, tblPersonaArticulo.intEstado,
        tblPersonaArticulo.distributivo, tblArticulo.intIdArticulo, tblArticulo.strCodigoArticulo, tblArticulo.strNombreArticulo, tblArticulo.strDescripcion, tblArticulo.intCampo, tblArticulo.intLineasInvestigacion, tblArticulo.intProcedencia, tblArticulo.dateFechaPublicacion, tblArticulo.bitComision, 
        tblArticulo.intEstado AS estadoArticulo, tblArticulo.registro, tblArticuloRegCient.textCartadeAceptacion AS ruta1, '' AS ruta2, '' AS ruta3, '1' AS tipoPublica, tblArticuloRegCient.intEstado AS estadoPublica
        FROM tblArticuloRegCient INNER JOIN tblArticulo ON tblArticuloRegCient.intArticulo = tblArticulo.intIdArticulo INNER JOIN
        tblPersonaArticulo ON tblArticulo.intIdArticulo = tblPersonaArticulo.intArticulo WHERE (tblPersonaArticulo.intPersona = `+ param1 + `) AND ((tblPersonaArticulo.intEstado = ` + param2 + `)
        OR (tblPersonaArticulo.intEstado = ` + param3 + `))
        UNION
        SELECT tblPersonaArticulo.intArticulo, tblPersonaArticulo.intPersona, tblPersonaArticulo.bitFilial, tblPersonaArticulo.bitPertinencia, tblPersonaArticulo.intEstado, tblPersonaArticulo.distributivo, tblArticulo.intIdArticulo, 
        tblArticulo.strCodigoArticulo, tblArticulo.strNombreArticulo, tblArticulo.strDescripcion, tblArticulo.intCampo, tblArticulo.intLineasInvestigacion, tblArticulo.intProcedencia, tblArticulo.dateFechaPublicacion, tblArticulo.bitComision, 
        tblArticulo.intEstado AS estadoArticulo, tblArticulo.registro, tblArticuloCongreso.textLibrodeMemoria AS ruta1, tblArticuloCongreso.textCartadeAceptacion AS ruta2, tblArticuloCongreso.textCertificadoPonente AS ruta3, '2' AS tipoPublica, tblArticuloCongreso.intEstado AS estadoPublica
        FROM tblArticulo INNER JOIN tblPersonaArticulo ON tblArticulo.intIdArticulo = tblPersonaArticulo.intArticulo INNER JOIN
        tblArticuloCongreso ON tblArticulo.intIdArticulo = tblArticuloCongreso.intArticulo WHERE (tblPersonaArticulo.intPersona = `+ param1 + `) AND ((tblPersonaArticulo.intEstado = ` + param2 + `)
        OR (tblPersonaArticulo.intEstado = ` + param3 + `))
        UNION
        SELECT tblPersonaArticulo.intArticulo, tblPersonaArticulo.intPersona, tblPersonaArticulo.bitFilial, tblPersonaArticulo.bitPertinencia, tblPersonaArticulo.intEstado, tblPersonaArticulo.distributivo, tblArticulo.intIdArticulo, 
        tblArticulo.strCodigoArticulo, tblArticulo.strNombreArticulo, tblArticulo.strDescripcion, tblArticulo.intCampo, tblArticulo.intLineasInvestigacion, tblArticulo.intProcedencia, tblArticulo.dateFechaPublicacion, tblArticulo.bitComision, 
        tblArticulo.intEstado AS estadoArticulo, tblArticulo.registro, tblLibro.textLibro AS ruta1, '' AS ruta2, '' AS ruta3, '3' AS tipoPublica, '1' AS estadoPublica
        FROM tblArticulo INNER JOIN tblPersonaArticulo ON tblArticulo.intIdArticulo = tblPersonaArticulo.intArticulo INNER JOIN
        tblLibro ON tblArticulo.intIdArticulo = tblLibro.intArticulo WHERE (tblPersonaArticulo.intPersona = `+ param1 + `) AND ((tblPersonaArticulo.intEstado = ` + param2 + `)
        OR (tblPersonaArticulo.intEstado = ` + param3 + `))`;
    if (opcion == 19) //REVISTAS
        sentencia = "SELECT tblRevista.intIdRevista, tblRevista.strNombre, tblRevista.strPais, tblRevista.strIssn, tblRevista.intBasedeDatos, "
            + "tblRevista.strDescripcion, tblRevista.strFactorSJR, tblRevista.strCuartilSJR, tblRevista.strFactorJCR, "
            + "tblRevista.strCuartilJCR, IIF(tblRevista.intEstado = 1, 'INDEXADA', 'NO INDEXADA') AS detEstado, tblRevista.strLink, tblBasedeDatos.strNombre AS Expr1, tblBasedeDatos.intIdBasedeDatos "
            + "FROM tblRevista INNER JOIN tblBasedeDatos ON tblRevista.intBasedeDatos = tblBasedeDatos.intIdBasedeDatos";
    if (opcion == 20) //BASES DE DATOS
        sentencia = "SELECT intIdBasedeDatos, strNombre, strDescripcion,  IIF(intEstado = 1, 'RECONOCIDA', 'NO RECONOCIDA') AS detEstado "
            + " FROM tblBasedeDatos";
    if (opcion == 21) //PROCEDENCIA DE LOS ARTICULOS 
        sentencia = "SELECT intIdProcedencia, strNombre, strDescripcion, intEstado, IIF(intEstado = 1, 'ACTIVO', 'NO ACTIVO') AS detEstado "
            + " FROM tblProdecencia";
    if (opcion == 22) //LINEAS DE INVESTIGACION
        sentencia = "SELECT intIdLineaVinvestigacion, strNombre, strDescripcion, intEstado, IIF(intEstado = 1, 'ACTIVO', 'NO ACTIVO') AS detEstado "
            + " FROM tblLineaVinvestigacion";
    if (opcion == 23) //TIPOS DE VERTIFICADO
        sentencia = "SELECT intIdTipoCertificado, strNombres, strDescripcion, intEstado, IIF(intEstado = 1, 'ACTIVO', 'NO ACTIVO') AS detEstado "
            + " FROM tblTipoCertificado";

    if (opcion == 24) //OBTENER EL ID DEL ULTIMO ARTICULO REGISTRADO
        sentencia = "SELECT TOP(1) intIdArticulo FROM tblArticulo WHERE (registro = '" + param1 + "') ORDER BY (intIdArticulo) DESC";
    if (opcion == 25) //OBTENER EL ULTIMO TOKEN
        sentencia = "SELECT TOP(1) idToken, strToken, dtFechaCreado, dtFechaExpira, DATEDIFF(HOUR, GETDATE(),dtFechaExpira) AS expira, strCreado FROM tblToken "
            + "WHERE (DATEDIFF(HOUR, GETDATE(),dtFechaExpira) > 1) ORDER BY idToken DESC";
    if (opcion == 26) //OBTENER TODO DATA ARTICULOS
        sentencia = `SELECT tblArticulo.intIdArticulo AS idArticulo, tblArticulo.strCodigoArticulo AS codigoArticulo, tblArticulo.strNombreArticulo AS nombreArticulo,
        tblArticulo.strDescripcion AS detalleArticulo, tblArticulo.intCampo AS campoArticulo, tblArticulo.intLineasInvestigacion AS lineaArticulo, tblArticulo.intProcedencia
        AS procedeArticulo, tblArticulo.dateFechaPublicacion AS fechaArticulo, tblArticulo.bitComision AS comisionArticulo, tblArticulo.intEstado AS estadoArticulo,
        tblArticuloRegCient.strDescripcion AS detalleRegCient, tblArticuloRegCient.textDoiArticulo AS doiRegCient, tblArticuloRegCient.textLinkArticulo AS linkRegCient, 
        tblArticuloRegCient.intRevista AS revistaRegCient, tblArticuloRegCient.intCampo AS campoRegCient, tblArticuloRegCient.intLineasInvestigacion AS lineaRegCient,
        tblArticuloRegCient.intTipoObra AS obraRegCient, tblArticuloRegCient.strVolumen AS volumenRegCient, tblArticuloRegCient.strNumero AS numeroRegCient, tblArticuloRegCient.strPaginas
        AS paginaRegCient, tblArticuloRegCient.bitIndexado AS indexadoRegCient, tblArticuloRegCient.bitComision AS comisionRegCient, tblArticuloRegCient.intEstado AS estadoRegCient,
        tblPersonaArticulo.intPersona, tblPersonaArticulo.bitFilial, tblPersonaArticulo.bitPertinencia, tblPersonaArticulo.intEstado, tblPersonaArticulo.distributivo, tblPersonaArticulo.intContrato,
        tblRevista.intIdRevista, tblRevista.strNombre, tblRevista.strPais, tblRevista.strIssn, tblRevista.strFactorSJR, tblRevista.strCuartilSJR, tblRevista.strFactorJCR,
        tblRevista.strCuartilJCR, tblPersona.strCedula, tblPersona.strNombres, tblPersona.strApellidos, tblPersona.strCorreo, tblPersona.strDependencia,
        tblArticuloRegCient.textCartadeAceptacion AS cartaAceptacion FROM tblArticuloRegCient INNER JOIN tblArticulo ON tblArticuloRegCient.intArticulo = tblArticulo.intIdArticulo
        INNER JOIN tblPersonaArticulo ON tblArticulo.intIdArticulo = tblPersonaArticulo.intArticulo INNER JOIN tblRevista ON tblArticuloRegCient.intRevista = tblRevista.intIdRevista
        INNER JOIN tblPersona ON tblPersonaArticulo.intPersona = tblPersona.intIdPersona WHERE (tblPersonaArticulo.intEstado = `+ param1 + `) OR (tblPersonaArticulo.intEstado = ` + param2 + `)`;
    if (opcion == 27) //OBTENER TODO DATA CONGRESOS
        sentencia = `SELECT tblPersonaArticulo.intArticulo, tblPersonaArticulo.intPersona, tblPersonaArticulo.bitFilial, tblPersonaArticulo.bitPertinencia, tblPersonaArticulo.intEstado, tblPersonaArticulo.distributivo, tblPersonaArticulo.intContrato, tblArticulo.intIdArticulo, 
        tblArticulo.strCodigoArticulo, tblArticulo.strNombreArticulo, tblArticulo.strDescripcion, tblArticulo.intCampo, tblArticulo.intLineasInvestigacion, tblArticulo.intProcedencia, tblArticulo.dateFechaPublicacion, tblArticulo.bitComision, 
        tblArticulo.intEstado AS estadoArticulo, tblArticulo.registro, tblArticulo.strDistributivo, tblArticuloCongreso.strDescripcion AS detalleArticuloCongreso, tblArticuloCongreso.textLinkArticuloCongreso, 
        tblArticuloCongreso.textLibrodeMemoria, tblArticuloCongreso.textCartadeAceptacion, tblArticuloCongreso.textCertificadoPonente, tblArticuloCongreso.intTipoObra, tblArticuloCongreso.intCongreso, 
        tblArticuloCongreso.bitComision AS comisionArticuloCongreso, tblArticuloCongreso.intEstado AS estadoArticuloCongreso, tblCongreso.intIdCongreso, tblCongreso.strNombreCongreso, tblCongreso.strComiteOrganizador, 
        tblCongreso.strPais, tblCongreso.strCuidad, tblCongreso.dateFechaInicio, tblCongreso.dateFechaFin, tblCongreso.bitRelevancia, tblCongreso.strIsbn, tblCongreso.strIssn, tblCongreso.intEstado AS estadoCongreso, 
        tblPersona.strCedula, tblPersona.strNombres, tblPersona.strApellidos, tblPersona.strCorreo, tblPersona.bitNombramiento, tblPersona.strDependencia
        FROM tblArticuloCongreso INNER JOIN tblArticulo ON tblArticuloCongreso.intArticulo = tblArticulo.intIdArticulo INNER JOIN tblPersonaArticulo ON tblArticulo.intIdArticulo = tblPersonaArticulo.intArticulo INNER JOIN
        tblCongreso ON tblArticuloCongreso.intCongreso = tblCongreso.intIdCongreso INNER JOIN tblPersona ON tblPersonaArticulo.intPersona = tblPersona.intIdPersona WHERE (tblPersonaArticulo.intEstado = `+ param1 + `) OR (tblPersonaArticulo.intEstado = ` + param2 + `)`;
    if (opcion == 28) //OBTENER TODO DATA LIBRON
        sentencia = `SELECT tblPersonaArticulo.intArticulo, tblPersonaArticulo.intPersona, tblPersonaArticulo.bitFilial, tblPersonaArticulo.bitPertinencia, tblPersonaArticulo.intEstado, tblPersonaArticulo.distributivo, tblPersonaArticulo.intContrato, tblArticulo.intIdArticulo, 
        tblArticulo.strCodigoArticulo, tblArticulo.strNombreArticulo, tblArticulo.strDescripcion, tblArticulo.intCampo, tblArticulo.intLineasInvestigacion, tblArticulo.intProcedencia, tblArticulo.dateFechaPublicacion, tblArticulo.bitComision, 
        tblArticulo.intEstado AS estadoArticulo, tblArticulo.registro, tblArticulo.strDistributivo, tblLibro.strNombreCapitulo, tblLibro.strIsbn, tblLibro.intTipoObra, tblLibro.bitRevisionPares AS revisaPares, tblLibro.intTomo, tblLibro.textEvaluacionPares, 
        tblLibro.textLibro, tblPersona.strCedula, tblPersona.strNombres, tblPersona.strApellidos, tblPersona.strCorreo, tblPersona.bitNombramiento, tblPersona.strDependencia, tblLibro.bitRevisionPares, tblLibro.strPais
        FROM tblLibro INNER JOIN tblArticulo ON tblLibro.intArticulo = tblArticulo.intIdArticulo INNER JOIN tblPersonaArticulo ON tblArticulo.intIdArticulo = tblPersonaArticulo.intArticulo INNER JOIN
         tblPersona ON tblPersonaArticulo.intPersona = tblPersona.intIdPersona WHERE (tblPersonaArticulo.intEstado = `+ param1 + `) OR (tblPersonaArticulo.intEstado = ` + param2 + `)`;
    if (opcion == 29) //OBTENER LAS REVISTAS
        sentencia = `SELECT intIdRevista, strNombre, strPais, strIssn, intBasedeDatos, strDescripcion, strFactorSJR, strCuartilSJR, strFactorJCR, strCuartilJCR, intEstado, strLink
        FROM tblRevista`;
    if (opcion == 30) //OBTENER LOS TIPOS DE OBRAS
        sentencia = `SELECT intIdTipoObra, strNombre, strDescripcion, intEstado FROM tblTipoObra`;
    if (opcion == 31) //OBTENER AJUSTES CERTIFICADOS
        sentencia = `SELECT idAjuste, strNombre, strDetalle FROM tblAjustes`;
    if (opcion == 32) //OBTIENE TODAS LAS SOLICITUDES DE CERTIFICADO PARA FIRMA DEL DIRECTOR
        sentencia = `SELECT tbCertificado.intIdCertificado, tbPersona.intIdPersona, tbCertificado.strCedula, tbCertificado.strNombres, tbCertificado.strApellidos, tbPersona.strCargo, 
        tbPersona.strDependencia, tbCertificado.intEstado, tbCertificado.dateFecha, tbCertificado.intTipoCertificado, tbCertificado.nomCertificado, tbCertificado.rutaCertificado, 
        tbCertificado.dtFechaSolicita, tbCertificado.dtFechaFirma FROM
        (SELECT tblCertificados.intIdCertificado, tblCertificados.strCedula, tblCertificados.strNombres, tblCertificados.strApellidos, tblCertificados.intEstado, tblCertificados.dateFecha, tblCertificados.intTipoCertificado, 
        tblCertificados.rutaCertificado, tblCertificados.dtFechaSolicita, tblCertificados.dtFechaFirma, tblTipoCertificado.strNombres AS nomCertificado
        FROM tblCertificados INNER JOIN tblTipoCertificado ON tblCertificados.intTipoCertificado = tblTipoCertificado.intIdTipoCertificado) AS tbCertificado
        INNER JOIN tblPersona AS tbPersona ON tbCertificado.strCedula = tbPersona.strCedula 
		ORDER BY tbCertificado.dtFechaSolicita DESC`;
    ///CERTIFICADOS A FIRMAR
    if (opcion == 33) //CERTIFICADO ACUMULADO DOCENTES CONTRATO
        sentencia = `SELECT tblArticulo.strCodigoArticulo, tblArticulo.strNombreArticulo, tblArticulo.strDescripcion, tblArticulo.dateFechaPublicacion, tblArticulo.intEstado, tblArticulo.intIdArticulo, tblPersonaArticulo.bitPertinencia, 
        tblPersonaArticulo.intEstado AS estadoPerArt, tblPersonaArticulo.intPersona, tblPersonaArticulo.bitFilial, tblPersonaArticulo.intContrato, tblArticuloRegCient.intTipoObra, (SELECT TOP (1) strNombre FROM tblTipoObra WHERE (intIdTipoObra = 1)) AS nombTipo, (tblBasedeDatos.strNombre+'\n' +tblRevista.strNombre+IIF(tblRevista.strCuartilSJR='0','','\n SJR: '+
        tblRevista.strCuartilSJR)+IIF(tblRevista.strCuartilJCR='0','','\n JCR: '+tblRevista.strCuartilJCR)+'\n ISSN: '+tblRevista.strIssn) AS detallePublicacion, tblRevista.strPais FROM tblArticulo INNER JOIN tblPersonaArticulo
        ON tblArticulo.intIdArticulo = tblPersonaArticulo.intArticulo INNER JOIN tblArticuloRegCient ON tblArticulo.intIdArticulo = tblArticuloRegCient.intArticulo INNER JOIN tblRevista ON tblArticuloRegCient.intRevista = tblRevista.intIdRevista INNER JOIN
        tblBasedeDatos ON tblRevista.intBasedeDatos = tblBasedeDatos.intIdBasedeDatos WHERE (tblPersonaArticulo.intEstado = 1) AND (tblPersonaArticulo.intPersona = `+ param1 + `)
        UNION
        SELECT tblArticulo.strCodigoArticulo, tblArticulo.strNombreArticulo, tblArticulo.strDescripcion, tblArticulo.dateFechaPublicacion, tblArticulo.intEstado, tblArticulo.intIdArticulo, tblPersonaArticulo.bitPertinencia, 
        tblPersonaArticulo.intEstado AS estadoPerArt, tblPersonaArticulo.intPersona, tblPersonaArticulo.bitFilial, tblPersonaArticulo.intContrato, tblLibro.intTipoObra, (SELECT TOP (1) strNombre FROM tblTipoObra WHERE (intIdTipoObra = 1)) AS nombTipo,  ('Libro \n'+tblLibro.textEvaluacionPares+'\n ISBN'+tblLibro.strIsbn) AS detallePublicacion, tblLibro.strPais
        FROM tblArticulo INNER JOIN tblPersonaArticulo ON tblArticulo.intIdArticulo = tblPersonaArticulo.intArticulo INNER JOIN tblLibro ON tblArticulo.intIdArticulo = tblLibro.intArticulo WHERE (tblPersonaArticulo.intEstado = 1)
        AND (tblPersonaArticulo.intPersona = `+ param1 + `)
        UNION
        SELECT tblArticulo.strCodigoArticulo, tblArticulo.strNombreArticulo, tblArticulo.strDescripcion, tblArticulo.dateFechaPublicacion, tblArticulo.intEstado, tblArticulo.intIdArticulo, tblPersonaArticulo.bitPertinencia, 
        tblPersonaArticulo.intEstado AS estadoPerArt, tblPersonaArticulo.intPersona, tblPersonaArticulo.bitFilial, tblPersonaArticulo.intContrato, tblArticuloCongreso.intTipoObra, (SELECT TOP (1) strNombre FROM tblTipoObra WHERE (intIdTipoObra = 1)) AS nombTipo,  (tblCongreso.strNombreCongreso+'\n ISBN:'+tblCongreso.strIsbn+IIF(tblCongreso.strIssn ='','','\n ISSN: '+
        tblCongreso.strIssn)) AS detallePublicacion, tblCongreso.strPais FROM tblArticulo INNER JOIN tblPersonaArticulo ON tblArticulo.intIdArticulo = tblPersonaArticulo.intArticulo INNER JOIN tblArticuloCongreso ON
        tblArticulo.intIdArticulo = tblArticuloCongreso.intArticulo INNER JOIN tblCongreso ON tblArticuloCongreso.intCongreso = tblCongreso.intIdCongreso WHERE (tblPersonaArticulo.intEstado = 1) AND (tblPersonaArticulo.intPersona = `+ param1 + `)
        ORDER BY tblArticulo.dateFechaPublicacion`;
    ///CERTIFICADOS A FIRMAR   
    if (opcion == 34) //CERTIFICADO ACUMULADO DOCENTES CONTRATO
        sentencia = `SELECT tblArticulo.strCodigoArticulo, tblArticulo.strNombreArticulo, tblArticulo.strDescripcion, tblArticulo.dateFechaPublicacion, tblArticulo.intEstado, tblArticulo.intIdArticulo, tblPersonaArticulo.bitPertinencia, 
        tblPersonaArticulo.intEstado AS estadoPerArt, tblPersonaArticulo.intPersona, tblPersonaArticulo.bitFilial, tblPersonaArticulo.intContrato, tblArticuloRegCient.intTipoObra, (SELECT TOP (1) strNombre FROM tblTipoObra WHERE (intIdTipoObra = 1)) AS nombTipo,  (tblBasedeDatos.strNombre+'\n' +tblRevista.strNombre+IIF(tblRevista.strCuartilSJR='0','','\n SJR: '+
        tblRevista.strCuartilSJR)+IIF(tblRevista.strCuartilJCR='0','','\n JCR: '+tblRevista.strCuartilJCR)+'\n ISSN: '+tblRevista.strIssn) AS detallePublicacion, tblRevista.strPais FROM tblArticulo INNER JOIN tblPersonaArticulo
        ON tblArticulo.intIdArticulo = tblPersonaArticulo.intArticulo INNER JOIN tblArticuloRegCient ON tblArticulo.intIdArticulo = tblArticuloRegCient.intArticulo INNER JOIN tblRevista ON tblArticuloRegCient.intRevista = tblRevista.intIdRevista INNER JOIN
        tblBasedeDatos ON tblRevista.intBasedeDatos = tblBasedeDatos.intIdBasedeDatos WHERE (tblPersonaArticulo.intEstado = 1) AND (tblPersonaArticulo.intPersona = `+ param1 + `) AND (tblPersonaArticulo.intContrato = 1)
        UNION
        SELECT tblArticulo.strCodigoArticulo, tblArticulo.strNombreArticulo, tblArticulo.strDescripcion, tblArticulo.dateFechaPublicacion, tblArticulo.intEstado, tblArticulo.intIdArticulo, tblPersonaArticulo.bitPertinencia, 
        tblPersonaArticulo.intEstado AS estadoPerArt, tblPersonaArticulo.intPersona, tblPersonaArticulo.bitFilial, tblPersonaArticulo.intContrato, tblLibro.intTipoObra, (SELECT TOP (1) strNombre FROM tblTipoObra WHERE (intIdTipoObra = 1)) AS nombTipo,  ('Libro \n'+tblLibro.textEvaluacionPares+'\n ISBN'+tblLibro.strIsbn) AS detallePublicacion, tblLibro.strPais
        FROM tblArticulo INNER JOIN tblPersonaArticulo ON tblArticulo.intIdArticulo = tblPersonaArticulo.intArticulo INNER JOIN tblLibro ON tblArticulo.intIdArticulo = tblLibro.intArticulo WHERE (tblPersonaArticulo.intEstado = 1)
        AND (tblPersonaArticulo.intPersona = `+ param1 + `) AND (tblPersonaArticulo.intContrato = 1)
        UNION
        SELECT tblArticulo.strCodigoArticulo, tblArticulo.strNombreArticulo, tblArticulo.strDescripcion, tblArticulo.dateFechaPublicacion, tblArticulo.intEstado, tblArticulo.intIdArticulo, tblPersonaArticulo.bitPertinencia, 
        tblPersonaArticulo.intEstado AS estadoPerArt, tblPersonaArticulo.intPersona, tblPersonaArticulo.bitFilial, tblPersonaArticulo.intContrato, tblArticuloCongreso.intTipoObra, (SELECT TOP (1) strNombre FROM tblTipoObra WHERE (intIdTipoObra = 1)) AS nombTipo,  (tblCongreso.strNombreCongreso+'\n ISBN:'+tblCongreso.strIsbn+IIF(tblCongreso.strIssn ='','','\n ISSN: '+
        tblCongreso.strIssn)) AS detallePublicacion, tblCongreso.strPais FROM tblArticulo INNER JOIN tblPersonaArticulo ON tblArticulo.intIdArticulo = tblPersonaArticulo.intArticulo INNER JOIN tblArticuloCongreso ON
        tblArticulo.intIdArticulo = tblArticuloCongreso.intArticulo INNER JOIN tblCongreso ON tblArticuloCongreso.intCongreso = tblCongreso.intIdCongreso
        WHERE (tblPersonaArticulo.intEstado = 1) AND (tblPersonaArticulo.intPersona = `+ param1 + `) AND (tblPersonaArticulo.intContrato = 1) ORDER BY tblArticulo.dateFechaPublicacion`;
    if (opcion == 35) //OBTENER LOS DATOS DE LOS CONGRESOS REGISTRADOS
        sentencia = `SELECT intIdCongreso, strNombreCongreso, strComiteOrganizador, strPais, strCuidad, dateFechaInicio, dateFechaFin, bitRelevancia, strIsbn, strIssn, intEstado
        FROM tblCongreso`;
    if (opcion == 36) //REPORTE PARA EL DIRECTOR
        sentencia = `SELECT tblPersonaArticulo.intArticulo, tblPersonaArticulo.intPersona, tblPersonaArticulo.bitFilial, tblPersonaArticulo.bitPertinencia, tblPersonaArticulo.intEstado, tblPersonaArticulo.distributivo, tblArticulo.intIdArticulo, 
        tblArticulo.strCodigoArticulo, tblArticulo.strNombreArticulo, tblArticulo.strDescripcion, tblArticulo.intCampo, tblArticulo.intLineasInvestigacion, tblArticulo.intProcedencia, tblArticulo.dateFechaPublicacion, tblArticulo.bitComision, 
        tblArticulo.intEstado AS estadoArticulo, tblArticulo.registro, tblArticuloRegCient.textCartadeAceptacion AS ruta1, '' AS ruta2, '' AS ruta3, '1' AS tipoPublica, tblArticuloRegCient.intEstado AS estadoPublica, 
        tblTipoObra.strNombre AS nombObra, tblPersona.strCedula AS cedAutor, tblPersona.strNombres AS nombAutor, tblPersona.strApellidos AS apAutor
        FROM tblArticuloRegCient INNER JOIN tblArticulo ON tblArticuloRegCient.intArticulo = tblArticulo.intIdArticulo INNER JOIN tblPersonaArticulo ON tblArticulo.intIdArticulo = tblPersonaArticulo.intArticulo INNER JOIN
        tblTipoObra ON tblArticuloRegCient.intTipoObra = tblTipoObra.intIdTipoObra INNER JOIN tblPersona ON tblPersonaArticulo.intPersona = tblPersona.intIdPersona
        WHERE (tblPersonaArticulo.intEstado = 1) AND ((tblArticulo.strCodigoArticulo LIKE '`+ param1 + `%')  OR (tblPersona.strCedula = '` + para
        m1 + `'))
        AND (tblArticulo.dateFechaPublicacion >= CONVERT(DATETIME, '`+ param2 + ` 00:00:00', 102) AND tblArticulo.dateFechaPublicacion <= CONVERT(DATETIME, '` + param3 + ` 23:55:00', 102))
        UNION
        SELECT tblPersonaArticulo.intArticulo, tblPersonaArticulo.intPersona, tblPersonaArticulo.bitFilial, tblPersonaArticulo.bitPertinencia, tblPersonaArticulo.intEstado, tblPersonaArticulo.distributivo, tblArticulo.intIdArticulo, 
        tblArticulo.strCodigoArticulo, tblArticulo.strNombreArticulo, tblArticulo.strDescripcion, tblArticulo.intCampo, tblArticulo.intLineasInvestigacion, tblArticulo.intProcedencia, tblArticulo.dateFechaPublicacion, tblArticulo.bitComision, 
        tblArticulo.intEstado AS estadoArticulo, tblArticulo.registro, tblArticuloCongreso.textLibrodeMemoria AS ruta1, tblArticuloCongreso.textCartadeAceptacion AS ruta2, tblArticuloCongreso.textCertificadoPonente AS ruta3, 
        '2' AS tipoPublica, tblArticuloCongreso.intEstado AS estadoPublica, tblTipoObra.strNombre AS nombObra, tblPersona.strCedula AS cedAutor, tblPersona.strNombres AS nombAutor, tblPersona.strApellidos AS apAutor
        FROM tblArticulo INNER JOIN tblPersonaArticulo ON tblArticulo.intIdArticulo = tblPersonaArticulo.intArticulo INNER JOIN tblArticuloCongreso ON tblArticulo.intIdArticulo = tblArticuloCongreso.intArticulo INNER JOIN
        tblTipoObra ON tblArticuloCongreso.intTipoObra = tblTipoObra.intIdTipoObra INNER JOIN tblPersona ON tblPersonaArticulo.intPersona = tblPersona.intIdPersona
        WHERE (tblPersonaArticulo.intEstado = 1) AND ((tblArticulo.strCodigoArticulo LIKE '`+ param1 + `%')  OR (tblPersona.strCedula = '` + param1 + `'))
        AND (tblArticulo.dateFechaPublicacion >= CONVERT(DATETIME, '`+ param2 + ` 00:00:00', 102) AND tblArticulo.dateFechaPublicacion <= CONVERT(DATETIME, '` + param3 + ` 23:55:00', 102))
        UNION
        SELECT tblPersonaArticulo.intArticulo, tblPersonaArticulo.intPersona, tblPersonaArticulo.bitFilial, tblPersonaArticulo.bitPertinencia, tblPersonaArticulo.intEstado, tblPersonaArticulo.distributivo, tblArticulo.intIdArticulo, 
        tblArticulo.strCodigoArticulo, tblArticulo.strNombreArticulo, tblArticulo.strDescripcion, tblArticulo.intCampo, tblArticulo.intLineasInvestigacion, tblArticulo.intProcedencia, tblArticulo.dateFechaPublicacion, tblArticulo.bitComision, 
        tblArticulo.intEstado AS estadoArticulo, tblArticulo.registro, tblLibro.textLibro AS ruta1, '' AS ruta2, '' AS ruta3, '3' AS tipoPublica, '1' AS estadoPublica, tblTipoObra.strNombre AS nombObra, tblPersona.strCedula AS cedAutor, tblPersona.strNombres AS nombAutor, tblPersona.strApellidos AS apAutor
        FROM tblArticulo INNER JOIN tblPersonaArticulo ON tblArticulo.intIdArticulo = tblPersonaArticulo.intArticulo INNER JOIN tblLibro ON tblArticulo.intIdArticulo = tblLibro.intArticulo INNER JOIN
        tblTipoObra ON tblLibro.intTipoObra = tblTipoObra.intIdTipoObra INNER JOIN tblPersona ON tblPersonaArticulo.intPersona = tblPersona.intIdPersona
        AND (tblArticulo.dateFechaPublicacion >= CONVERT(DATETIME, '`+ param2 + ` 00:00:00', 102) AND tblArticulo.dateFechaPublicacion <= CONVERT(DATETIME, '` + param3 + ` 23:55:00', 102))
        WHERE (tblPersonaArticulo.intEstado = 1) AND ((tblArticulo.strCodigoArticulo LIKE '`+ param1 + `%')  OR (tblPersona.strCedula = '` + param1 + `'))
        AND (tblArticulo.dateFechaPublicacion >= CONVERT(DATETIME, '`+ param2 + ` 00:00:00', 102) AND tblArticulo.dateFechaPublicacion <= CONVERT(DATETIME, '` + param3 + ` 23:55:00', 102))`;

    if (opcion == 40) //VER LA SOLICITUDES REALIZADAS DE UN USUARIO
        sentencia = `SELECT tblCertificados.intIdCertificado, tblCertificados.strCedula, tblCertificados.strNombres, tblCertificados.strApellidos, tblCertificados.intEstado,
        tblCertificados.dateFecha, tblCertificados.intTipoCertificado, tblCertificados.rutaCertificado, tblCertificados.dtFechaSolicita, tblCertificados.dtFechaFirma,
        tblTipoCertificado.strNombres AS nombCertificado, tblTipoCertificado.strDescripcion FROM tblCertificados INNER JOIN tblTipoCertificado ON tblCertificados.intTipoCertificado
        = tblTipoCertificado.intIdTipoCertificado WHERE (tblCertificados.strCedula = '`+ param1 + `')`;
    if (opcion == 41) //OBTENER TODOS LOS ARTICULO ACEPTADOS POR EL ANALISTA
        sentencia = `SELECT tblArticulo.intIdArticulo AS idArticulo, tblArticulo.strCodigoArticulo AS codigoArticulo, tblArticulo.strNombreArticulo AS nombreArticulo, tblArticulo.strDescripcion AS detalleArticulo, tblArticulo.intCampo AS campoArticulo, 
        tblArticulo.intLineasInvestigacion AS lineaArticulo, tblArticulo.intProcedencia AS procedeArticulo, tblArticulo.dateFechaPublicacion AS fechaArticulo, tblArticulo.bitComision AS comisionArticulo, 
        tblArticulo.intEstado AS estadoArticulo, tblArticuloRegCient.strDescripcion AS detalleRegCient, tblArticuloRegCient.textDoiArticulo AS doiRegCient, tblArticuloRegCient.textLinkArticulo AS linkRegCient, 
        tblArticuloRegCient.intRevista AS revistaRegCient, tblArticuloRegCient.intCampo AS campoRegCient, tblArticuloRegCient.intLineasInvestigacion AS lineaRegCient, tblArticuloRegCient.intTipoObra AS obraRegCient, 
        tblArticuloRegCient.strVolumen AS volumenRegCient, tblArticuloRegCient.strNumero AS numeroRegCient, tblArticuloRegCient.strPaginas AS paginaRegCient, tblArticuloRegCient.bitIndexado AS indexadoRegCient, 
        tblArticuloRegCient.bitComision AS comisionRegCient, tblArticuloRegCient.intEstado AS estadoRegCient, tblPersonaArticulo.intPersona, tblPersonaArticulo.bitFilial, tblPersonaArticulo.bitPertinencia, tblPersonaArticulo.intEstado, 
        tblPersonaArticulo.distributivo, tblRevista.intIdRevista, tblRevista.strNombre, tblRevista.strPais, tblRevista.strIssn, tblRevista.strFactorSJR, tblRevista.strCuartilSJR, tblRevista.strFactorJCR, tblRevista.strCuartilJCR, 
        tblPersona.strCedula, tblPersona.strNombres, tblPersona.strApellidos, tblPersona.strCorreo, tblPersona.strDependencia, tblArticuloRegCient.textCartadeAceptacion AS cartaAceptacion FROM tblArticuloRegCient INNER JOIN tblArticulo ON
        tblArticuloRegCient.intArticulo = tblArticulo.intIdArticulo INNER JOIN tblPersonaArticulo ON tblArticulo.intIdArticulo = tblPersonaArticulo.intArticulo INNER JOIN
        tblRevista ON tblArticuloRegCient.intRevista = tblRevista.intIdRevista INNER JOIN tblPersona ON tblPersonaArticulo.intPersona = tblPersona.intIdPersona
        WHERE ((tblPersonaArticulo.intEstado = `+ param1 + `) OR (tblPersonaArticulo.intEstado = ` + param2 + `)) AND (tblArticulo.strCodigoArticulo LIKE 'RC%')`;
    if (opcion == 42) //VER LOS AUTORES DE UN ARTICULO
        sentencia = `SELECT tblPersonaArticulo.intArticulo, tblPersonaArticulo.intPersona, tblPersona.strCedula, tblPersona.strNombres, tblPersona.strApellidos, tblPersona.strCorreo,
        tblPersona.strTelefono, tblPersona.strCargo, tblPersona.strDependencia FROM tblPersonaArticulo INNER JOIN tblPersona ON tblPersonaArticulo.intPersona = tblPersona.intIdPersona
        WHERE (tblPersonaArticulo.intArticulo = `+ param1 + `)`;
    if (opcion == 43) //VER UNA PERSONA DADA SU CEDULA
        sentencia = `SELECT TOP (1) intIdPersona, strCedula, strNombres, strApellidos, strCorreo, strTelefono, strCargo, bitNombramiento, strDependencia, intEstado FROM tblPersona
        WHERE (strCedula = '`+ param1 + `')`;
    if (opcion == 44)//VISTA DE LA PRODUCCIÓN CIENTÍFICA REGISTRADA
        sentencia = `SELECT tblPersonaArticulo.intArticulo, tblPersonaArticulo.intPersona, tblPersonaArticulo.bitFilial, tblPersonaArticulo.bitPertinencia, tblPersonaArticulo.intEstado,
            tblPersonaArticulo.distributivo, tblArticulo.intIdArticulo, tblArticulo.strCodigoArticulo, tblArticulo.strNombreArticulo, tblArticulo.strDescripcion, tblArticulo.intCampo, tblArticulo.intLineasInvestigacion, tblArticulo.intProcedencia, tblArticulo.dateFechaPublicacion, tblArticulo.bitComision, 
            tblArticulo.intEstado AS estadoArticulo, tblArticulo.registro, tblArticuloRegCient.textCartadeAceptacion AS ruta1, '' AS ruta2, '' AS ruta3, '1' AS tipoPublica, tblArticuloRegCient.intEstado AS estadoPublica
            FROM tblArticuloRegCient INNER JOIN tblArticulo ON tblArticuloRegCient.intArticulo = tblArticulo.intIdArticulo INNER JOIN
            tblPersonaArticulo ON tblArticulo.intIdArticulo = tblPersonaArticulo.intArticulo WHERE (tblPersonaArticulo.intEstado = ` + param2 + `)
            OR (tblPersonaArticulo.intEstado = ` + param3 + `)
            UNION
            SELECT tblPersonaArticulo.intArticulo, tblPersonaArticulo.intPersona, tblPersonaArticulo.bitFilial, tblPersonaArticulo.bitPertinencia, tblPersonaArticulo.intEstado, tblPersonaArticulo.distributivo, tblArticulo.intIdArticulo, 
            tblArticulo.strCodigoArticulo, tblArticulo.strNombreArticulo, tblArticulo.strDescripcion, tblArticulo.intCampo, tblArticulo.intLineasInvestigacion, tblArticulo.intProcedencia, tblArticulo.dateFechaPublicacion, tblArticulo.bitComision, 
            tblArticulo.intEstado AS estadoArticulo, tblArticulo.registro, tblArticuloCongreso.textLibrodeMemoria AS ruta1, tblArticuloCongreso.textCartadeAceptacion AS ruta2, tblArticuloCongreso.textCertificadoPonente AS ruta3, '2' AS tipoPublica, tblArticuloCongreso.intEstado AS estadoPublica
            FROM tblArticulo INNER JOIN tblPersonaArticulo ON tblArticulo.intIdArticulo = tblPersonaArticulo.intArticulo INNER JOIN
            tblArticuloCongreso ON tblArticulo.intIdArticulo = tblArticuloCongreso.intArticulo WHERE (tblPersonaArticulo.intEstado = ` + param2 + `)
            OR (tblPersonaArticulo.intEstado = ` + param3 + `)
            UNION
            SELECT tblPersonaArticulo.intArticulo, tblPersonaArticulo.intPersona, tblPersonaArticulo.bitFilial, tblPersonaArticulo.bitPertinencia, tblPersonaArticulo.intEstado, tblPersonaArticulo.distributivo, tblArticulo.intIdArticulo, 
            tblArticulo.strCodigoArticulo, tblArticulo.strNombreArticulo, tblArticulo.strDescripcion, tblArticulo.intCampo, tblArticulo.intLineasInvestigacion, tblArticulo.intProcedencia, tblArticulo.dateFechaPublicacion, tblArticulo.bitComision, 
            tblArticulo.intEstado AS estadoArticulo, tblArticulo.registro, tblLibro.textLibro AS ruta1, '' AS ruta2, '' AS ruta3, '3' AS tipoPublica, '1' AS estadoPublica
            FROM tblArticulo INNER JOIN tblPersonaArticulo ON tblArticulo.intIdArticulo = tblPersonaArticulo.intArticulo INNER JOIN
            tblLibro ON tblArticulo.intIdArticulo = tblLibro.intArticulo WHERE (tblPersonaArticulo.intEstado = ` + param2 + `)
            OR (tblPersonaArticulo.intEstado = ` + param3 + `)`;
    if (opcion == 45)//VER LOS CAMPOS DE CONOCIMIENTOS
        sentencia = `SELECT intIdCampoA, strCodigo, strNombre, strDescripcion, intEstado FROM tblCampoAmplio`;

    console.log(sentencia)

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

module.exports.postGestionUsuarios = function (dato1, dato2, dato3, dato4, dato5, dato6, dato7, dato8, dato9, dato10, dato11, dato12, dato13, dato14, dato15, opcion, Callback) {
    var today = new Date();
    var day = today.getDate();
    var month = today.getMonth() + 1;
    var year = today.getFullYear();
    var fechaActual = year + '-' + month + '-' + day;
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
            + " '" + dato2 + "', '" + dato3 + "', '" + dato4 + "', " + dato5 + ")";
    if (opcion == 5)
        sentencia = "INSERT INTO tblPersonaRol (intPersosa, intRol, intEstado) VALUES (" + dato1 + ", " + dato2 + ", " + dato3 + ")";
    if (opcion == 6)
        sentencia = "INSERT INTO tblPadreOpcion (strNombre, intEstado, strIcono, tipo) VALUES "
            + "('" + dato2 + "', " + dato3 + ", '" + dato4 + "', " + dato5 + ")";
    if (opcion == 7)
        sentencia = "INSERT INTO tblRolOpcion (intRol, intOpcion, intPadreOpcion, bitInsertar, bitModificar, bitEliminar, intEstado) VALUES "
            + "(" + dato1 + ", " + dato2 + ", " + dato3 + ", '" + dato4 + "', '" + dato5 + "', '" + dato6 + "', " + dato7 + ")";
    if (opcion == 8)
        sentencia = "INSERT INTO tblArticuloRegCient (intArticulo, strDescripcion, textDoiArticulo, textLinkArticulo, intRevista, intCampo, "
            + "intLineasInvestigacion, intTipoObra, strVolumen, strNumero, strPaginas, textCartadeAceptacion, bitIndexado, bitComision, intEstado) "
            + "VALUES ((SELECT TOP(1) intIdArticulo FROM tblArticulo WHERE (registro = '" + dato1 + "') ORDER BY (intIdArticulo) DESC), '" + dato2 + "', '"
            + dato3 + "', '" + dato4 + "', " + dato5 + ", " + dato6 + ", " + dato7 + ", " + dato8 + ", '" + dato9 + "', '" + dato10 + "', '" + dato11
            + "', '" + dato12 + "', " + dato13 + ", " + dato14 + ", " + dato15 + ")";
    if (opcion == 9)  //// GUARDAR UNA SOLICITUD       
        sentencia = "INSERT INTO tblCertificados (strCedula, strNombres, strApellidos, intEstado, dateFecha, intTipoCertificado, rutaCertificado, dtFechaSolicita, dtFechaFirma) "
            + "VALUES ('" + dato2 + "', '" + dato3 + "', '" + dato4 + "', " + dato5 + " , '" + fechaActual + "', " + dato6 + ", '-', GETDATE(),GETDATE())";
    if (opcion == 10)  //// GUARDAR UNA SOLICITUD       
        sentencia = "INSERT INTO tblCertificados (strCedula, strNombres, strApellidos, intEstado, dateFecha, intTipoCertificado) "
            + "VALUES ('" + dato2 + "', '" + dato3 + "', '" + dato4 + "', " + dato5 + " , '" + fechaActual + "', " + dato6 + ")";
    if (opcion == 11)  //REGISTRO DE DATOS DE UN ARTICULO
        sentencia = "INSERT INTO tblArticulo (strCodigoArticulo, strNombreArticulo, strDescripcion, intCampo, intLineasInvestigacion, "
            + "intProcedencia, dateFechaPublicacion, bitComision, intEstado, registro, strDistributivo) VALUES ('" + dato2 + "', '" + dato3 + "', '"
            + dato4 + "', " + dato5 + ", " + dato6 + ", " + dato7 + ", '" + dato8 + "', " + dato9 + ", " + dato10 + ", '" + dato11 + "', '" + dato12 + "')";
    if (opcion == 12) //ASIGNA UN ARTICULO A UNA PERSONA
        sentencia = "IF NOT EXISTS (SELECT * FROM tblPersonaArticulo WHERE intArticulo=" + dato1 + " AND intPersona=" + dato2 + ") BEGIN "
            + "INSERT INTO tblPersonaArticulo (intArticulo, intPersona, bitFilial, bitPertinencia, intEstado, distributivo, intContrato) "
            + "VALUES (" + dato1 + ", " + dato2 + ", " + dato3 + ", " + dato4 + ", " + dato5 + ", '" + dato6 + "', 0) END";
    if (opcion == 13) //INSERTAR UNA REVISTA 
        sentencia = "INSERT INTO tblRevista (strNombre, strPais, strIssn, intBasedeDatos, strDescripcion, strFactorSJR, strCuartilSJR, "
            + "strFactorJCR, strCuartilJCR, intEstado, strLink) VALUES ('" + dato2 + "', '" + dato3 + "', '"
            + dato4 + "', " + dato5 + ", " + dato6 + ", " + dato7 + ", '" + dato8 + "', " + dato9 + ", " + dato10 + ", '" + dato11 + "')";
    if (opcion == 14) //INSERTAR UNA REVISTA 
        sentencia = "UPDATE tblRevista SET strNombre='" + dato2 + "', strPais='" + dato3 + "', strIssn='" + dato4
            + "', intBasedeDatos='" + dato5 + "', strDescripcion='" + dato6 + "', strFactorSJR='" + dato7 + "', strCuartilSJR='" + dato8 + "',"
            + "strFactorJCR='" + dato9 + "', strCuartilJCR=" + dato10 + "', intEstado='" + dato11 + "',strLink='" + dato11 + "' WHERE (intIdRevista = " + dato1 + ")";
    if (opcion == 15) //INSERTAR UN NUEVO TOKEN
        sentencia = "INSERT INTO tblToken (strToken, dtFechaCreado, dtFechaExpira, strCreado) VALUES ('" + dato1 + "', '" + dato2 + "', '" + dato3 + "', '" + dato4 + "')";
    if (opcion == 16) //INSERTAR UN ARTICULO EN UN CONGRESO
        sentencia = "INSERT INTO tblArticuloCongreso(intArticulo, strDescripcion, textLinkArticuloCongreso, textLibrodeMemoria, textCartadeAceptacion, textCertificadoPonente, "
            + "intTipoObra, intCongreso, bitComision, intEstado) VALUES(" + dato1 + ", '" + dato2 + "', '" + dato3 + "', '" + dato4 + "', '" + dato5 + "', '" + dato6 + "', " + dato7
            + ", " + dato8 + ", " + dato9 + ", " + dato10 + ")";
    if (opcion == 17) //INSERTAR UN LIBRO
        sentencia = "INSERT INTO tblLibro(intArticulo, strNombreCapitulo, strIsbn, intTipoObra, bitRevisionPares, intTomo, textEvaluacionPares, textLibro) VALUES(" + dato1
            + ", '" + dato2 + "', '" + dato3 + "', " + dato4 + ", " + dato5 + ", " + dato6 + ", '" + dato7 + "', '" + dato8 + "')";
    if (opcion == 18) //ACTUALIZAMOS LA INFORMACION DE UN ARTICULO
        sentencia = "UPDATE tblArticulo SET strCodigoArticulo = '" + dato2 + "', strNombreArticulo = '" + dato3 + "', strDescripcion = '" + dato4 + "', intLineasInvestigacion = "
            + dato5 + ", intProcedencia = " + dato6 + ", dateFechaPublicacion = '" + dato7 + "', bitComision = '" + dato8 + "', intEstado = " + dato9 + " WHERE intIdArticulo = " + dato1;
    if (opcion == 19) //ACTUALIZAMOS LA INFORMACION DE UN ARTICULO DE UN AUTOR
        sentencia = "UPDATE tblPersonaArticulo SET bitFilial = '" + dato2 + "', bitPertinencia = '" + dato3 + "', intEstado = " + dato4 + ", intContrato = " + dato5 + " WHERE intArticulo = " + dato1;
    if (opcion == 20) //ACTUALIZAMOS LA INFORMACION DEL REGISTRO DEL ARTICULO
        sentencia = "UPDATE tblArticuloRegCient SET strDescripcion = '" + dato2 + "', textDoiArticulo = '" + dato3 + "', textLinkArticulo = '" + dato4 + "', intRevista = " + dato5
            + ", intCampo = " + dato6 + ", intLineasInvestigacion = " + dato7 + ", intTipoObra = " + dato8 + ", strVolumen = '" + dato9 + "', strNumero = '" + dato10 + "', strPaginas = '"
            + dato11 + "', bitIndexado = '" + dato12 + "', bitComision = '" + dato13 + "', intEstado = " + dato14 + " WHERE intArticulo = " + dato1;
    if (opcion == 21) //ACTUALIZAR UNA SOLICITUD FIRMADA
        sentencia = "UPDATE tblCertificados SET dtFechaFirma = GETDATE(), rutaCertificado = '" + dato2 + "', intEstado = 1 WHERE intIdCertificado = " + dato1;
    if (opcion == 22) //ACTUALIZAR UN ROL DE USUARIO
        sentencia = "UPDATE tblRol SET strNombre='" + dato2 + "', strDescripcion='" + dato3 + "', intEstado = '" + dato4 + "' WHERE intIdRol = " + dato1;
    if (opcion == 23) //ACTUALIZAR LAS ACTIVIADES DE UN ROL DE USUARIO
        sentencia = "UPDATE tblRolOpcion SET bitInsertar='" + dato4 + "', bitModificar='" + dato5 + "', bitEliminar = '" + dato6 + "', intEstado = " + dato7 + " WHERE intRol = " + dato1;
    if (opcion == 24) //EDITAR UN LIBRO
        sentencia = "UPDATE tblLibro SET strNombreCapitulo = '" + dato2 + "', strIsbn = '" + dato3 + "', intTipoObra = " + dato4 + ", bitRevisionPares = '" + dato5
            + "', intTomo = " + dato6 + ", strPais = '" + dato7 + "' WHERE intArticulo = " + dato1;
    if (opcion == 25) //INSERTAR UN ARTICULO EN UN CONGRESO
        sentencia = "UPDATE tblArticuloCongreso SET textLinkArticuloCongreso = '" + dato2 + "', intTipoObra = '" + dato3 + "', intCongreso  = '" + dato4
            + "', bitComision = '" + dato5 + "', intEstado = " + dato6 + " WHERE intArticulo = " + dato1;

    console.log(sentencia);

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