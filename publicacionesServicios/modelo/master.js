const db = require('../config/baseMaster');
const sql = require('mssql');


module.exports.obtenerInformacionCarreras = function (opcion, param1, param2, param3, callback) {
    var conn = new sql.ConnectionPool(db);
    var req = new sql.Request(conn);
    var sentencia;
    if (opcion == 1)//OBTIENE TODAS LAS FACULTADES DE LA INSTITUCION
        sentencia = "SELECT strCodigo, strNombre, strDecano, strUbicacion, strCodEstado, strCodTipoEntidad FROM Facultades WHERE (strCodEstado = 'ABI') AND (strCodigo <> 'CAA')";
    if (opcion == 2)//OBTIENE LAS CARRERAS QUE PERTENECE A UNA FACULTAD DADO EL CODIGO
        sentencia = "SELECT Facultades.strCodigo AS codFacultad, Facultades.strNombre AS nombFacultad, Escuelas.strCodigo AS codEscuela, Escuelas.strNombre AS nombEscuela, "
            + "Carreras.strCodigo AS codCarrera, Carreras.strNombre AS nombCarrera, Carreras.strBaseDatos AS baseDatos, Carreras.strSede AS sede, Carreras.strCodEstado AS "
            + "estCarrera FROM Carreras INNER JOIN Escuelas ON Carreras.strCodEscuela = Escuelas.strCodigo INNER JOIN Facultades ON Escuelas.strCodFacultad = "
            + "Facultades.strCodigo WHERE(Facultades.strCodigo = '" + param1 + "') AND(Carreras.strCodEstado = 'ABI')";
    if (opcion == 3)//OBTIENE TODOS LOS PERÍODOS ACADEMICOS
        sentencia = "SELECT strCodigo, strDescripcion, dtFechaInic, dtFechaFin, dtFechaTopeMatOrd, dtFechaTopeMatExt, dtFechaTopeMatPro, "
            + "dtFechaTopeRetMat, strCodReglamento FROM Periodos WHERE (strCodigo LIKE 'P%') ORDER BY dtFechaInic DESC";
    if (opcion == 4)//OBTIENE TODA LA INFORMACION DE UNA CARRERA DADO EL CODIGO DE CARRERA
        sentencia = "SELECT Facultades.strCodigo AS codigoFacultad, Facultades.strNombre AS nombreFacultad, Facultades.strDecano AS decanoFacultad, Facultades.strCodEstado AS "
            + "estadoFacultad, Escuelas.strCodigo AS codigoEscuela, Escuelas.strNombre AS nombreEscuela, Escuelas.strDirector AS directorEscuela, Escuelas.strCodEstado AS estadoEscuela, "
            + "Carreras.strCodigo AS codigoCarrera, Carreras.strNombre AS nombreCarrera, Carreras.strCodEstado AS estadoCarrera, Carreras.strBaseDatos AS baseCarrera, Carreras.strSede AS "
            + "sedeCarrera, Carreras.carrera_unica AS unicaCarrera FROM Carreras INNER JOIN Escuelas ON Carreras.strCodEscuela = Escuelas.strCodigo INNER JOIN Facultades ON "
            + "Escuelas.strCodFacultad = Facultades.strCodigo WHERE (Carreras.strCodigo = '" + param1 + "') OR (Carreras.strBaseDatos = '" + param1 + "')";
    if (opcion == 5)//OBTIENE EL CODIGO UNICO DADO EL CODIGO DE CARRERA
        sentencia = "SELECT strCodigo, strNombre, strCodEstado, strBaseDatos, strCodEscuela, carrera_unica FROM Carreras WHERE (strCodigo = '" + param1 + "')";
    if (opcion == 6)//OBTIENE TODA LA INFORMACION DE LAS CARRERA QUE PERTENECEN A UN CODIGO UNICO
        sentencia = "SELECT Facultades.strCodigo AS codigoFacultad, Facultades.strNombre AS nombreFacultad, Facultades.strDecano AS decanoFacultad, Facultades.strCodEstado AS "
            + "estadoFacultad, Escuelas.strCodigo AS codigoEscuela, Escuelas.strNombre AS nombreEscuela, Escuelas.strDirector AS directorEscuela, Escuelas.strCodEstado AS estadoEscuela, "
            + "Carreras.strCodigo AS codigoCarrera, Carreras.strNombre AS nombreCarrera, Carreras.strCodEstado AS estadoCarrera, Carreras.strBaseDatos AS baseCarrera, Carreras.strSede AS "
            + "sedeCarrera, Carreras.carrera_unica AS unicaCarrera FROM Carreras INNER JOIN Escuelas ON Carreras.strCodEscuela = Escuelas.strCodigo INNER JOIN Facultades ON "
            + "Escuelas.strCodFacultad = Facultades.strCodigo WHERE (Carreras.carrera_unica = '" + param1 + "')";
    if (opcion == 7)//OBTIENE TODAS LOS CODIGOS DE CARRERA UNICA DADO LA FACULTAD
        sentencia = "SELECT DISTINCT Facultades.strCodigo, Facultades.strNombre, Facultades.strCodEstado, Escuelas.strCodEstado AS codEscuela, Carreras.carrera_unica FROM Facultades "
            + "INNER JOIN Escuelas ON Facultades.strCodigo = Escuelas.strCodFacultad INNER JOIN Carreras ON Escuelas.strCodigo = Carreras.strCodEscuela WHERE (Facultades.strCodEstado = "
            + "'ABI') AND (Facultades.strCodigo = '" + param1 + "') AND (Carreras.carrera_unica IS NOT NULL)";
    if (opcion == 8)//DETERMINA EL COLEGIO Y TIPO DADO LA CEDULA DEL ESTUDIANTE
        sentencia = "SELECT Estudiantes.strCedula, Estudiantes.strNombres, Estudiantes.strApellidos, Instituciones.strNombre, Instituciones.strCodTipo, Tipos_Instituciones."
            + "strDescripcion, Titulos.strCodigo AS codTitulo, Titulos.strNombre AS nombTitulo, Grados.dtFecha FROM Estudiantes INNER JOIN Grados ON Estudiantes.strCedula = Grados.strCedEstud "
            + "INNER JOIN Titulos_Validos ON Grados.strCodTit = Titulos_Validos.strCodTit AND Grados.strCodInt = Titulos_Validos.strCodInt INNER JOIN Instituciones ON "
            + "Titulos_Validos.strCodInt = Instituciones.strCodigo INNER JOIN Tipos_Instituciones ON Instituciones.strCodTipo = Tipos_Instituciones.strCodigo INNER JOIN Titulos "
            + "ON Titulos_Validos.strCodTit = Titulos.strCodigo WHERE (REPLACE(Estudiantes.strCedula, '-', '') = '" + param1 + "') AND (Instituciones.strCodTipo <> 'POLE')";
    if (opcion == 9) {//VARIOS CRITERIOS DE BUSQUEDA DE UN ESTUDIANTE
        var dato1 = param1.split(' ').length > 0 ? param1.split(' ')[0] : param1;
        var dato2 = param1.split(' ').length > 0 ? param1.split(' ')[1] : 'na';
        sentencia = "SELECT  strCedula, strNombres, strApellidos, dtFechaNac, strLugarNac, strNacionalidad, strDir, strTel, strEmail, strCodSexo FROM Estudiantes WHERE "
            + "(REPLACE(strCedula, '-', '') = '" + param1 + "') OR ((strNombres LIKE '%" + dato1 + "%') AND (strApellidos LIKE '%" + dato2 + "%')) OR (strNombres LIKE '%"
            + param1 + "%') OR (strApellidos LIKE '%" + param1 + "%')";
    }
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
module.exports.obtenerInformacionMatricula = function (opcion, carrera, param1, param2, param3, callback) {
    var conn = new sql.ConnectionPool(db);
    var req = new sql.Request(conn);

    var hoy = new Date();
    var diahoy = hoy.getDate() < 10 ? "0" + hoy.getDate() : hoy.getDate();
    var meshoy = (hoy.getMonth() + 1) < 10 ? "0" + (hoy.getMonth() + 1) : (hoy.getMonth() + 1);
    var annohoy = hoy.getFullYear();
    var fechaHoy = annohoy + "-" + meshoy + "-" + diahoy;

    var sentencia = "";
    if (opcion == 1)//OBTIENE TODAS LAS MATRIUCLAS QUE TIENE EL ESTUDIANTE DADO LA CEDULA
        sentencia = "SELECT Inscripciones.intCodigo, Inscripciones.strCedEstud, Inscripciones.strCodCarrera, Inscripciones.strCodPeriodo, Carreras.strBaseDatos AS baseCarrera, "
            + "Carreras.strNombre AS nombCarrera, Carreras.strSede, Facultades.strCodigo AS codFacultad, Facultades.strNombre AS nombFacultad FROM Inscripciones INNER JOIN Carreras ON strCodCarrera = "
            + "Carreras.strCodigo INNER JOIN Escuelas ON Carreras.strCodEscuela = Escuelas.strCodigo INNER JOIN Facultades ON Escuelas.strCodFacultad = Facultades.strCodigo WHERE "
            + "(REPLACE(strCedEstud, '-', '') = '" + param1 + "') AND (strCodCarrera <> 'CEF') AND(strCodCarrera <> 'CI') AND(strCodCarrera <> 'CV') ORDER BY strCodPeriodo DESC";
    if (opcion == 2)//OBTIENE LA MATRICULA DE UN ESTUDIANTE DADO EL CODIGO DE ESTUDIANTE Y PERIODO
        sentencia = "SELECT TOP (1) Estudiantes.strCodigo, Estudiantes.strCedula, Estudiantes.strNombres, Estudiantes.strApellidos, Estudiantes.dtFechaNac, Estudiantes.dtFechaIng, "
            + "Estudiantes.strEmail, Estudiantes.strNacionalidad, Estudiantes.strCodSexo, Matriculas.sintCodigo, Matriculas.strCodPeriodo, Matriculas.strCodNivel, Matriculas.strCodEstado "
            + "FROM [" + carrera + "].dbo.Estudiantes INNER JOIN[" + carrera + "].dbo.Matriculas ON Estudiantes.strCodigo = Matriculas.strCodEstud WHERE((Estudiantes.strCodigo = '" +
            param1 + "') OR (REPLACE(Estudiantes.strCedula, '-', '') = '" + param1 + "')) AND(Matriculas.strCodPeriodo = '" + param2 + "') AND(Matriculas.strCodEstado = 'DEF');";
    if (opcion == 3)//DETERMINA LA MATRICULA VIGENTE DEL ESTUDIANTE EN CASO DE TENER
        sentencia = "SELECT Matriculas.strCodPeriodo, Estudiantes.strCedula, Estudiantes.strCodigo AS codEstudiante, Estudiantes.dtFechaNac, Periodos.dtFechaInic, Periodos.dtFechaFin, "
            + "Periodos.strDescripcion, Matriculas.strCodNivel, Periodos.strCodPensum FROM [" + carrera + "].dbo.Matriculas INNER JOIN [" + carrera + "].dbo.Estudiantes ON Matriculas."
            + "strCodEstud = Estudiantes.strCodigo INNER JOIN [" + carrera + "].dbo.Periodos ON Matriculas.strCodPeriodo = Periodos.strCodigo WHERE (REPLACE(Estudiantes.strCedula, '-', "
            + "'') = '" + param1 + "') AND (Matriculas.strCodEstado = 'DEF') AND (Periodos.dtFechaInic <= CONVERT(DATETIME, '" + fechaHoy + " 23:00:00', 102)) AND (Periodos.dtFechaFin "
            + ">= CONVERT(DATETIME, '" + fechaHoy + " 00:00:00', 102))";
    if (opcion == 30)//OBTIENE LA INFORMACIÓN DE UN ESTUDIANTE CON SUS MATRICULAS DADO SU CEDULA
        sentencia = "SELECT TOP (1) Estudiantes.strCodigo, Estudiantes.strCedula, Estudiantes.strNombres, Estudiantes.strApellidos, Estudiantes.dtFechaNac, Estudiantes.dtFechaIng, "
            + "Estudiantes.strEmail, Estudiantes.strNacionalidad, Estudiantes.strCodSexo, Matriculas.sintCodigo, Matriculas.strCodPeriodo, Matriculas.strCodNivel, Matriculas.strCodEstado "
            + "FROM[" + carrera + "].dbo.Estudiantes INNER JOIN [" + carrera + "].dbo.Matriculas ON Estudiantes.strCodigo = Matriculas.strCodEstud WHERE (REPLACE ("
            + "Estudiantes.strCedula, '-', '') = '" + param1 + "'); ";
    if (opcion == 31)//DETERMINA SI UN ESTUDIANTE SE ENCUENTRA EGRESADO DADO LA CEDULA Y CARRERA
        sentencia = "SELECT Estudiantes.strCodigo, Estudiantes.strCedula, Estudiantes.strNombres, Estudiantes.strApellidos, Egresados.intCodigo, Egresados.strCodTitulo, Egresados."
            + "fltPromNotas, Egresados.fltCreditos, Egresados.fltPuntosRepEstud, Egresados.dtFechaAprob, Egresados.strResolucion, Egresados.dtFechaAsentado FROM [" + carrera + "].dbo."
            + "Egresados INNER JOIN [" + carrera + "].dbo.Estudiantes ON Egresados.strCodEstud = Estudiantes.strCodigo WHERE (REPLACE(Estudiantes.strCedula, '-', '') = '" + param1 + "');";
    if (opcion == 32)//DETERMINA SI UN ESTUDIANTE SE ENCUENTRA TITULADO DADO LA CEDULA Y CARRERA
        sentencia = "SELECT intCodigo, intCodEgre, intCodProyecto, strNumActa, fltPromNotas, fltNotaPromEsc, fltNotaPromOral, fltNotaPromGrado, fltCreditos, dtFechaGrado "
            + "FROM [" + carrera + "].dbo.Graduados WHERE (intCodEgre = " + param1 + ");";
    if (opcion == 33)//DETERMINA LA MATRICULA DE UN ESTUDIANTE DADO LA CEDULA Y PERIODO ACADEMICO
        sentencia = "SELECT Matriculas.strCodPeriodo, Estudiantes.strCedula, Estudiantes.strCodigo AS codEstudiante, Estudiantes.dtFechaNac, Periodos.dtFechaInic, Periodos.dtFechaFin, "
            + "Periodos.strDescripcion, Matriculas.strCodNivel, Periodos.strCodPensum FROM [" + carrera + "].dbo.Matriculas INNER JOIN [" + carrera + "].dbo.Estudiantes ON Matriculas.strCodEstud = "
            + "Estudiantes.strCodigo INNER JOIN [" + carrera + "].dbo.Periodos ON Matriculas.strCodPeriodo = Periodos.strCodigo WHERE(REPLACE(Estudiantes.strCedula, '-', '') = '" + param1 + "') AND "
            + "(Matriculas.strCodEstado = 'DEF') AND (Matriculas.strCodPeriodo = '" + param2 + "')";

    /*===========================   FUNCIONES DE BECAS DE ALTO RENDIMIENTO   ===========================*/
    if (opcion == 4)//DETERMINA TODAS LAS MATRICULAS DEFINITIVAS QUE TIENE UNA DETERMINADA CARRERA
        sentencia = "SELECT Estudiantes.strCodigo, Estudiantes.strCedula, Estudiantes.strNombres, Estudiantes.strApellidos, Estudiantes.strEmail, Estudiantes.strNacionalidad, "
            + "Estudiantes.strCodSexo, Matriculas.strCodPeriodo, Matriculas.strCodNivel, Matriculas.strCodEstado, Periodos.strCodPensum FROM [" + carrera + "].dbo.Matriculas INNER JOIN "
            + "[" + carrera + "].dbo.Estudiantes ON Matriculas.strCodEstud = Estudiantes.strCodigo INNER JOIN [" + carrera + "].dbo.Periodos ON Matriculas.strCodPeriodo = Periodos.strCodigo "
            + "WHERE(Matriculas.strCodPeriodo = '" + param1 + "') AND(Matriculas.strCodEstado = 'DEF')  ORDER BY Matriculas.strCodNivel";
    if (opcion == 5)//MATERIAS OBLIGATORIAS DICTADAS EN UN SEMESTRE DADO EL CODIGO DEL MISMO
        sentencia = "SELECT [" + carrera + "].dbo.Materias.strCodigo AS codMateria, [" + carrera + "].dbo.Materias.strNombre AS nombMateria, [" + carrera + "].dbo.Materias_Pensum.strCodPensum, "
            + "[" + carrera + "].dbo.Materias_Pensum.strCodNivel AS nivel FROM[" + carrera + "].dbo.Materias_Pensum INNER JOIN [" + carrera + "].dbo.Materias ON "
            + "[" + carrera + "].dbo.Materias_Pensum.strCodMateria = [" + carrera + "].dbo.Materias.strCodigo INNER JOIN [" + carrera + "].dbo.Pensums ON "
            + "[" + carrera + "].dbo.Materias_Pensum.strCodPensum = [" + carrera + "].dbo.Pensums.strCodigo WHERE([" + carrera + "].dbo.Materias_Pensum.strCodNivel = '" + param1 + "') "
            + "AND ([" + carrera + "].dbo.Materias.blnActiva = 1) AND ([" + carrera + "].dbo.Pensums.blnActivo = 1) AND([" + carrera + "].dbo.Materias_Pensum.strCodTipo = 'NOR')";
    if (opcion == 6)//MATERIAS MATRICULADAS CON PRIMERA DEL ESTUDIANTE DADO EL SEMESTRE Y PERIODO
        sentencia = "SELECT [" + carrera + "].dbo.Matriculas.sintCodigo AS codMatricula, [" + carrera + "].dbo.Matriculas.strCodEstud, [" + carrera + "].dbo.Matriculas.strCodPeriodo, "
            + "[" + carrera + "].dbo.Matriculas.strCodNivel, [" + carrera + "].dbo.Matriculas.strCodEstado, [" + carrera + "].dbo.Materias_Asignadas.strCodMateria, "
            + "[" + carrera + "].dbo.Materias_Asignadas.bytNumMat FROM[" + carrera + "].dbo.Matriculas INNER JOIN[" + carrera + "].dbo.Materias_Asignadas ON "
            + "[" + carrera + "].dbo.Matriculas.sintCodigo = [" + carrera + "].dbo.Materias_Asignadas.sintCodMatricula AND[" + carrera + "].dbo.Matriculas.strCodPeriodo = "
            + "[" + carrera + "].dbo.Materias_Asignadas.strCodPeriodo INNER JOIN[" + carrera + "].dbo.Notas_Examenes ON[" + carrera + "].dbo.Materias_Asignadas.sintCodMatricula = "
            + "[" + carrera + "].dbo.Notas_Examenes.sintCodMatricula AND[" + carrera + "].dbo.Materias_Asignadas.strCodPeriodo = [" + carrera + "].dbo.Notas_Examenes.strCodPeriodo AND "
            + "[" + carrera + "].dbo.Materias_Asignadas.strCodMateria = [" + carrera + "].dbo.Notas_Examenes.strCodMateria WHERE([" + carrera + "].dbo.Matriculas.strCodEstud = '" + param1 + "') "
            + "AND([" + carrera + "].dbo.Matriculas.strCodEstado = 'DEF') AND([" + carrera + "].dbo.Matriculas.strCodPeriodo = '" + param2 + "') "
            + "AND([" + carrera + "].dbo.Materias_Asignadas.bytNumMat = 1)";
    if (opcion == 7)//DETERMIA SI UN ESTUDIANTE APRUEBA UNA MATERIA CON PRIMERA Y OBTIENE SU NOTA Y ASISTENACIA (SIN SUNSPENCION)
        sentencia = "SELECT Matriculas.sintCodigo, Matriculas.strCodPeriodo, Matriculas.strCodEstud, Matriculas.strCodNivel, Materias_Asignadas.strCodMateria, Materias.strNombre, "
            + "Materias_Asignadas.bytNumMat, Materias_Asignadas.bytAsistencia, Notas_Examenes.strCodTipoExamen, Notas_Examenes.bytAcumulado, Notas_Examenes.bytNota, Notas_Examenes."
            + "strCodEquiv FROM [" + carrera + "].dbo.Materias INNER JOIN [" + carrera + "].dbo.Materias_Asignadas ON Materias.strCodigo = Materias_Asignadas.strCodMateria INNER JOIN "
            + "[" + carrera + "].dbo.Matriculas ON Materias_Asignadas.sintCodMatricula = Matriculas.sintCodigo AND Materias_Asignadas.strCodPeriodo = Matriculas.strCodPeriodo INNER "
            + "JOIN [" + carrera + "].dbo.Notas_Examenes ON Materias_Asignadas.sintCodMatricula = Notas_Examenes.sintCodMatricula AND Materias_Asignadas.strCodPeriodo = "
            + "Notas_Examenes.strCodPeriodo AND Materias_Asignadas.strCodMateria = Notas_Examenes.strCodMateria WHERE (Matriculas.strCodEstud = '" + param1 + "') AND "
            + "(Materias_Asignadas.strCodMateria = '" + param2 + "') AND (Notas_Examenes.strCodEquiv = 'A' OR Notas_Examenes.strCodEquiv = 'E') AND (Notas_Examenes.strCodTipoExamen = 'PRI') "
            + "AND(Materias_Asignadas.bytNumMat = 1)";
    if (opcion == 8)//DETERMIA SI UN ESTUDIANTE APRUEBA UNA MATERIA CON PRIMERA Y OBTIENE SU NOTA Y ASISTENACIA (CON SUNSPENCION)
        sentencia = "SELECT Matriculas.sintCodigo, Matriculas.strCodPeriodo, Matriculas.strCodEstud, Matriculas.strCodNivel, Materias_Asignadas.strCodMateria, Materias.strNombre, "
            + "Materias_Asignadas.bytNumMat, Materias_Asignadas.bytAsistencia, Notas_Examenes.strCodTipoExamen, Notas_Examenes.bytAcumulado, Notas_Examenes.bytNota, Notas_Examenes.strCodEquiv "
            + "FROM [" + carrera + "].dbo.Materias INNER JOIN [" + carrera + "].dbo.Materias_Asignadas ON Materias.strCodigo = Materias_Asignadas.strCodMateria INNER JOIN "
            + "[" + carrera + "].dbo.Matriculas ON Materias_Asignadas.sintCodMatricula = Matriculas.sintCodigo AND Materias_Asignadas.strCodPeriodo = Matriculas.strCodPeriodo INNER JOIN "
            + "[" + carrera + "].dbo.Notas_Examenes ON Materias_Asignadas.sintCodMatricula = Notas_Examenes.sintCodMatricula AND Materias_Asignadas.strCodPeriodo = Notas_Examenes.strCodPeriodo "
            + "AND Materias_Asignadas.strCodMateria = Notas_Examenes.strCodMateria WHERE(Matriculas.strCodEstud = '" + param1 + "') AND (Materias_Asignadas.strCodMateria = '" + param2 + "') "
            + "AND(Notas_Examenes.strCodEquiv = 'A' OR Notas_Examenes.strCodEquiv = 'E') AND (Materias_Asignadas.bytNumMat = 1)";
    if (opcion == 10)//DETERMINA SI EL ESTUDIANTE CONVALIDA UNA MATERIA DADO EL CODIGO DEL ESTUDIANTE Y MATERIA
        sentencia = "SELECT Estudiantes.strCodigo, Estudiantes.strCedula, Estudiantes.strNombres, Estudiantes.strApellidos, Materias_Asignadas.strCodMateria, Materias.strNombre, "
            + "Convalidaciones.dtFechaAprob, Convalidaciones.strCodPeriodo, Convalidaciones.bytNota FROM [" + carrera + "].dbo.Estudiantes INNER JOIN [" + carrera + "].dbo.Matriculas "
            + "ON Estudiantes.strCodigo = Matriculas.strCodEstud INNER JOIN [" + carrera + "].dbo.Materias_Asignadas ON Matriculas.sintCodigo = Materias_Asignadas.sintCodMatricula AND "
            + "Matriculas.strCodPeriodo = Materias_Asignadas.strCodPeriodo INNER JOIN [" + carrera + "].dbo.Convalidaciones ON Materias_Asignadas.sintCodMatricula = Convalidaciones."
            + "sintCodMatricula AND Materias_Asignadas.strCodPeriodo = Convalidaciones.strCodPeriodo AND Materias_Asignadas.strCodMateria = Convalidaciones.strCodMateria INNER JOIN "
            + "[" + carrera + "].dbo.Materias ON Materias_Asignadas. strCodMateria = Materias.strCodigo WHERE(Estudiantes.strCodigo = '" + param1 + "') AND "
            + "(Materias_Asignadas.strCodMateria = '" + param2 + "')";
    if (opcion == 11)//MATERIAS OBLIGATORIAS DICTADAS EN UN SEMESTRE DADO EL CODIGO DEL MISMO
        sentencia = "SELECT DISTINCT Estudiantes.strCodigo, Estudiantes.strCedula, Estudiantes.strNombres, Estudiantes.strApellidos, Estudiantes.dtFechaNac, Estudiantes.strEmail, "
            + "Estudiantes.strNacionalidad, Estudiantes.strCodSexo, Matriculas.strCodPeriodo, Matriculas.strCodNivel, Matriculas.strCodEstado, Materias_Pensum.strCodPensum FROM "
            + "[" + carrera + "].dbo.Estudiantes INNER JOIN [" + carrera + "].dbo.Matriculas ON Estudiantes.strCodigo = Matriculas.strCodEstud INNER JOIN[" + carrera + "].dbo.Materias_Asignadas "
            + "ON Matriculas.sintCodigo = Materias_Asignadas.sintCodMatricula AND Matriculas.strCodPeriodo = Materias_Asignadas.strCodPeriodo INNER JOIN[" + carrera + "].dbo.Materias ON "
            + "Materias_Asignadas.strCodMateria = Materias.strCodigo INNER JOIN[" + carrera + "].dbo.Materias_Pensum ON Materias.strCodigo = Materias_Pensum.strCodMateria WHERE "
            + "(Matriculas.strCodPeriodo = '" + param1 + "') AND(Matriculas.strCodEstado = 'DEF') ORDER BY Matriculas.strCodNivel";
    if (opcion == 12)//DETERMINA LAS MATERIAS OBLIGATORIAS DICTADAS DADO UN PENSUM Y SEMESTRE.
        sentencia = "SELECT Materias.strCodigo AS codMateria, Materias.strNombre AS nombMateria, Materias_Pensum.strCodPensum, Materias_Pensum.strCodNivel AS nivel FROM "
            + "[" + carrera + "].dbo.Materias_Pensum INNER JOIN [" + carrera + "].dbo.Materias ON Materias_Pensum.strCodMateria = Materias.strCodigo INNER JOIN "
            + "[" + carrera + "].dbo.Pensums ON Materias_Pensum.strCodPensum = Pensums.strCodigo WHERE (Materias_Pensum.strCodNivel = '" + param1 + "') AND "
            + "(Materias_Pensum.strCodTipo = 'NOR') AND (Pensums.strCodigo = '" + param2 + "');";
    if (opcion == 13)//DETERMINA LAS MATERIAS MATRICULADAS DE UN ESTUDIANTE DADO EL CODIGO DEL ESTUDIANTE Y PERIODO
        sentencia = "SELECT Matriculas.sintCodigo, Matriculas.strCodPeriodo, Matriculas.strCodEstud, Matriculas.strCodNivel, Materias_Asignadas.strCodMateria, Materias_Asignadas."
            + "bytNumMat FROM [" + carrera + "].dbo.Matriculas INNER JOIN [" + carrera + "].dbo.Materias_Asignadas ON Matriculas.sintCodigo = Materias_Asignadas.sintCodMatricula AND "
            + "Matriculas.strCodPeriodo = Materias_Asignadas.strCodPeriodo WHERE(Matriculas.strCodPeriodo = '" + param2 + "') AND(Matriculas.strCodEstud = '" + param1 + "')";
    if (opcion == 14)//DETERMINA SI UNA MATERIA NO DEBE APROBAR UN ESTUDIANTE DADO EL CODIGO DEL ESTUDIANTE Y MATERIA
        sentencia = "SELECT strCodEstud, strCodMat, strResolucion, dtFechaAprob, strAsentadoPor FROM [" + carrera + "].dbo.Materias_Sin_Tener_Aprobar "
            + "WHERE (strCodMat = '" + param2 + "') AND (strCodEstud = '" + param1 + "')";
    if (opcion == 15)//DETERMIA SI UN ESTUDIANTE APRUEBA UNA MATERIA CON PRIMERA Y OBTIENE SU NOTA Y ASISTENACIA (SIN SUNSPENCION)
        sentencia = "SELECT Matriculas.sintCodigo, Matriculas.strCodPeriodo, Matriculas.strCodEstud, Matriculas.strCodNivel, Materias_Asignadas.strCodMateria, Materias.strNombre, "
            + "Materias_Asignadas.bytNumMat, Materias_Asignadas.bytAsistencia, Notas_Examenes.strCodTipoExamen, Notas_Examenes.bytAcumulado, Notas_Examenes.bytNota, Notas_Examenes.strCodEquiv, "
            + "Periodos.strDescripcion, Periodos.dtFechaInic, Periodos.dtFechaFin FROM [" + carrera + "].dbo.Materias INNER JOIN [" + carrera + "].dbo.Materias_Asignadas ON Materias."
            + "strCodigo = Materias_Asignadas.strCodMateria INNER JOIN [" + carrera + "].dbo.Matriculas ON Materias_Asignadas.sintCodMatricula = Matriculas.sintCodigo AND Materias_Asignadas."
            + "strCodPeriodo = Matriculas.strCodPeriodo INNER JOIN [" + carrera + "].dbo.Notas_Examenes ON Materias_Asignadas.sintCodMatricula = Notas_Examenes.sintCodMatricula AND "
            + "Materias_Asignadas.strCodPeriodo = Notas_Examenes.strCodPeriodo AND Materias_Asignadas.strCodMateria = Notas_Examenes.strCodMateria INNER JOIN Periodos ON Matriculas."
            + "strCodPeriodo = Periodos.strCodigo WHERE(Matriculas.strCodEstud = '" + param1 + "') AND(Materias_Asignadas.strCodMateria = '" + param2 + "') AND(Notas_Examenes.strCodEquiv = 'A' OR "
            + "Notas_Examenes.strCodEquiv = 'E' OR Notas_Examenes.strCodEquiv = 'R' OR Notas_Examenes.strCodEquiv = 'S')"
    //+ "(Notas_Examenes.strCodTipoExamen = 'PRI')";    
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
module.exports.obtenerInformacionPersona = function (opcion, param1, param2, param3, callback) {
    var conn = new sql.ConnectionPool(db);
    var req = new sql.Request(conn);
    var sentencia;
    if (opcion == 1)//LA CIUDAD Y PROVINCIA DE PROCEDENCIA DEL ESTUDIANTE
        sentencia = "SELECT TOP (1) Estudiantes.strCedula, Estudiantes.strNombres, Estudiantes.strApellidos, Estudiantes.strCodSexo, Estudiantes.strNacionalidad, Ciudades.strCodigo AS "
            + "codCiudad, Ciudades.strNombre AS nombCiudad, Provincias.strCodigo AS codProvincia, Provincias.strNombre AS nombProvincia FROM Estudiantes INNER JOIN Ciudades ON "
            + "Estudiantes.strCodCiudadProc = Ciudades.strCodigo INNER JOIN Provincias ON Ciudades.strCodProv = Provincias.strCodigo WHERE(Estudiantes.strCedula = '" + param1 + "')";

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
