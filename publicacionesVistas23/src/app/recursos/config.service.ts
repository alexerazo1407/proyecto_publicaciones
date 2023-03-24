import { Injectable } from '@angular/core';
import { recursosPublicaciones } from './interfaz';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { rutasSWPublicaciones } from '../rutasService/rutasServicios';

@Injectable()
export class configuracion {

  constructor(private http: HttpClient) { }

  cargarScriptInicio() {
    this.loadScript("../../assets/estilosInicio/inicio.js");
  }

  public loadScript(scriptUrl: string) {
    return new Promise((resolve, reject) => {
      const scriptElement = document.createElement('script')
      scriptElement.src = scriptUrl
      scriptElement.onload = resolve
      document.body.appendChild(scriptElement)
    })
  }

  cambiaRol(rol: any) {
    localStorage.setItem('banCargar', "0");
    localStorage.setItem("idUser", rol);
    let ruta: string = "/";
    if (rol == 1)
      ruta = "../adminInicio";
    else if (rol == 2)
      ruta = "../autorInicio";
    else
      ruta = "../analistaInicio";
    return (ruta);
  }

  FirmarEc(token: any, datos: any): Observable<any> {
    let direccion = recursosPublicaciones.rutaFirmaEC + 'rutaFirma/firmarDocumentos';
    return this.http.post<any>(direccion, datos, { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token).set('idaplicacion', rutasSWPublicaciones.idAppArchivo)
    .set('jwtsecret', rutasSWPublicaciones.claveArchivo).set('activo', 'true') });
  }

  recuperarArchivoFirmaEc(token: any, datos: any): Observable<any> {
    let direccion = recursosPublicaciones.rutaFirmaEC + 'rutaFirma/recuperarDocumentos';
    return this.http.post<any>(direccion, datos, { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token).set('idaplicacion', rutasSWPublicaciones.idAppArchivo)
    .set('jwtsecret', rutasSWPublicaciones.claveArchivo).set('activo', 'true') });
  }
}
