var selectFecha; localStorage.setItem("mensaje", "");
function mostrarCalendario() {
    meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    lasemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
    diassemana = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

    //fecha actual
    hoy = new Date(); //objeto fecha actual
    diasemhoy = hoy.getDay(); //dia semana actual
    diahoy = hoy.getDate(); //dia mes actual
    meshoy = hoy.getMonth(); //mes actual
    annohoy = hoy.getFullYear(); //año actual

    // Elementos del DOM: en cabecera de calendario 
    tit = document.getElementById("titulos"); //cabecera del calendario
    ant = document.getElementById("anterior"); //mes anterior 
    pos = document.getElementById("posterior"); //mes posterior
    // Elementos del DOM en primera fila
    f0 = document.getElementById("fila0");
    //Pie de calendario
    pie = document.getElementById("fechaactual");
    pie.innerHTML = "Fecha: " + lasemana[diasemhoy] + ", " + diahoy + " de " + meses[meshoy] + " de " + annohoy;
    selectFecha = annohoy + "-" + (meshoy + 1) + "-" + diahoy;
    localStorage.setItem("fechaReserva", selectFecha);
    localStorage.setItem("fechaHoy", annohoy + ":" + (meshoy + 1) + ":" + diahoy);
    //formulario: datos iniciales:
    //document.buscar.buscaanno.value=annohoy;
    // Definir elementos iniciales:
    mescal = meshoy; //mes principal
    annocal = annohoy //año principal
    //iniciar calendario:
    cabecera()
    primeralinea()
    escribirdias()
}
//FUNCIONES de creación del calendario:
//cabecera del calendario
function cabecera() {
    tit.innerHTML = meses[mescal] + " de " + annocal;
    mesant = mescal - 1; //mes anterior
    mespos = mescal + 1; //mes posterior
    if (mesant < 0) { mesant = 11; }
    if (mespos > 11) { mespos = 0; }
    ant.innerHTML = meses[mesant]
    pos.innerHTML = meses[mespos]
}
//primera línea de tabla: días de la semana.
function primeralinea() {
    for (i = 0; i < 7; i++) {
        celda0 = f0.getElementsByTagName("th")[i];
        celda0.innerHTML = diassemana[i]
    }
}
//rellenar celdas con los días
function escribirdias() {
    //Buscar dia de la semana del dia 1 del mes:
    primeromes = new Date(annocal, mescal, "1") //buscar primer día del mes
    prsem = primeromes.getDay() //buscar día de la semana del día 1
    prsem--; //adaptar al calendario español (empezar por lunes)
    if (prsem == -1) { prsem = 6; }
    //buscar fecha para primera celda:
    diaprmes = primeromes.getDate()
    prcelda = diaprmes - prsem; //restar días que sobran de la semana
    empezar = primeromes.setDate(prcelda) //empezar= tiempo UNIX 1ª celda
    diames = new Date() //convertir en fecha
    diames.setTime(empezar); //diames=fecha primera celda.
    //Recorrer las celdas para escribir el día:
    for (i = 1; i < 7; i++) { //localizar fila
        fila = document.getElementById("fila" + i);
        for (j = 0; j < 7; j++) {
            midia = diames.getDate()
            mimes = diames.getMonth()
            mianno = diames.getFullYear()

            celda = fila.getElementsByTagName("td")[j];
            celda.innerHTML = midia;
            //Recuperar estado inicial al cambiar de mes:
            celda.style.backgroundColor = "#DBDBDB";
            celda.style.color = "#000";

            // sabados y domingos en rojo
            if (j == 6 || j == 5) {
                celda.style.color = "#f11445";
            }
            //dias restantes del mes en gris
            if (mimes != mescal) {
                celda.style.color = "#A3A3A3";
                celda.style.backgroundColor = "#ECECEC";
            }
            //destacar la fecha actual
            if (mimes == meshoy && midia == diahoy && mianno == annohoy) {
                celda.style.backgroundColor = "#6FBC85";
                celda.innerHTML = "<cite title='Fecha Actual'>" + midia + "</cite>";
            }
            //pasar al siguiente día
            midia = midia + 1;
            diames.setDate(midia);
        }
    }
}

function verSelec(fila, columna) {
    escribirdias();
    primeromes = new Date(annocal, mescal, "1") //buscar primer día del mes
    prsem = primeromes.getDay() //buscar día de la semana del día 1
    prsem--; //adaptar al calendario español (empezar por lunes)
    if (prsem == -1) { prsem = 6; }
    diaprmes = primeromes.getDate()
    prcelda = diaprmes - prsem; //restar días que sobran de la semana
    empezar = primeromes.setDate(prcelda) //empezar= tiempo UNIX 1ª celda
    diames = new Date() //convertir en fecha
    diames.setTime(empezar); //diames=fecha primera celda.

    for (i = 1; i <= fila; i++) { //localizar fila
        for (j = 0; j < 7; j++) {
            midia = diames.getDate()
            mimes = diames.getMonth()
            mianno = diames.getFullYear()
            if (i == fila && j == columna) {
                diaSelec = midia;
                mesSelec = mimes;
                aniSelec = mianno;
            }
            midia = midia + 1;
            diames.setDate(midia);
        }
    }
    if ((mesSelec < meshoy) || (diaSelec < diahoy && (mesSelec < meshoy || mesSelec == meshoy))) {
        localStorage.setItem("mensaje", "La fecha seleccionada no puede ser anterior a la actual");
        document.getElementById('divMedicos').style.display = 'none';
    }
    else {
        if (((diahoy + 7 < diaSelec) || (meshoy + 2 <= mesSelec) || ((meshoy + 1 == mesSelec) && ((30 - diahoy + diaSelec) > 7)))
            && localStorage.getItem('calendario') == 0) {
            localStorage.setItem("mensaje", "La fecha máxima para reservar su turno es de 5 días");
            document.getElementById('divMedicos').style.display = 'none';
        }
        else {
            pie.innerHTML = "Fecha: " + lasemana[columna + 1] + ", " + diaSelec + " de " + meses[mesSelec] + " de " + aniSelec;
            localStorage.setItem("diaCalendar", lasemana[columna + 1]);
            selectFecha = aniSelec + "-" + (mesSelec + 1) + "-" + diaSelec;
            localStorage.setItem("fechaReserva", selectFecha);
            document.getElementById('divMedicos').style.display = 'block';
            
            fila1 = document.getElementById("fila"+fila);
            celda1 = fila1.getElementsByTagName("td")[columna];
            celda1.style.backgroundColor = "#6FBC85";
        }
    }
}
function verDate() {
    localStorage.setItem("mensaje", "Este día no se labora en la ESPOCH");
    document.getElementById('divMedicos').style.display = 'none';
}
//Ver mes anterior
function mesantes() {
    nuevomes = new Date() //nuevo objeto de fecha
    primeromes--; //Restamos un día al 1 del mes visualizado
    nuevomes.setTime(primeromes) //cambiamos fecha al mes anterior 
    mescal = nuevomes.getMonth() //cambiamos las variables que usarán las funciones
    annocal = nuevomes.getFullYear()
    cabecera() //llamada a funcion de cambio de cabecera
    escribirdias() //llamada a funcion de cambio de tabla.
}
//ver mes posterior
function mesdespues() {
    nuevomes = new Date() //nuevo obejto fecha
    tiempounix = primeromes.getTime() //tiempo de primero mes visible
    tiempounix = tiempounix + (45 * 24 * 60 * 60 * 1000) //le añadimos 45 días 
    nuevomes.setTime(tiempounix) //fecha con mes posterior.
    mescal = nuevomes.getMonth() //cambiamos variables 
    annocal = nuevomes.getFullYear()
    cabecera() //escribir la cabecera 
    escribirdias() //escribir la tabla
}
//volver al mes actual
function actualizar() {
    mescal = hoy.getMonth(); //cambiar a mes actual
    annocal = hoy.getFullYear(); //cambiar a año actual 
    cabecera() //escribir la cabecera
    escribirdias() //escribir la tabla
}
//ir al mes buscado
function mifecha() {
    //Recoger dato del año en el formulario
    mianno = document.buscar.buscaanno.value;
    //recoger dato del mes en el formulario
    listameses = document.buscar.buscames;
    opciones = listameses.options;
    num = listameses.selectedIndex
    mimes = opciones[num].value;
    //Comprobar si el año está bien escrito
    if (isNaN(mianno) || mianno < 1) {
        //año mal escrito: mensaje de error
        localStorage.setItem("mensaje", "El año no es válido:\n debe ser un número mayor que 0")
    }
    else { //año bien escrito: ver mes en calendario:
        mife = new Date(); //nueva fecha
        mife.setMonth(mimes); //añadir mes y año a nueva fecha
        mife.setFullYear(mianno);
        mescal = mife.getMonth(); //cambiar a mes y año indicados
        annocal = mife.getFullYear();
        cabecera() //escribir cabecera
        escribirdias() //escribir tabla
    }
}

function mostrarFecha() {
    localStorage.setItem("fechaReserva", selectFecha);
    document.getElementById('divMedicos').style.display = 'none';
}
