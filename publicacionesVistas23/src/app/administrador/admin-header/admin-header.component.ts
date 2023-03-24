import { Component, OnInit } from '@angular/core';
import { swPublicaciones } from '../../serviciosPublicaciones/serviciosPublicaciones.service';
import { SesionUsuario } from '../../AutenticacionCas/SesionUsuario';
import { Router } from '@angular/router';
import { configuracion } from '../../recursos/config.service';
import { AlertifyService } from 'src/app/recursos/alertify.service';
import { CasClient } from "../../AutenticacionCas/CasClient";

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css',
    '../../../assets/estilosAdmin/css/main.css',]
})
export class AdminHeaderComponent implements OnInit {

  public nombUsuario: any; public intRol: number = 1;
  public vecRolPersona: Array<any>; public selectRol: number;


  constructor(private swPublicacion: swPublicaciones, private rutaCambio: Router, private config: configuracion, private router: Router, private alerti: AlertifyService,
    private casClose:CasClient) {
    this.nombUsuario = localStorage.getItem('loginCorreo');
    this.vecRolPersona = []; this.selectRol = 0;
  }

  ngOnInit() {
    if (localStorage.getItem('loginID') == null || localStorage.getItem('loginID') == '' ||
      localStorage.getItem('loginCorreo') == null || localStorage.getItem('loginCorreo') == '' ||
      localStorage.getItem('loginNombre') == null || localStorage.getItem('loginNombre') == '') {
      this.alerti.error('Acceso no autorizado');
      this.router.navigate(["/"]);
    } else {
      if (localStorage.getItem('banCargar') == '0') {
        location.reload();
        localStorage.setItem('banCargar', '1')
      }
      this.consumirRoles();
    }
  }
  async consumirRoles() {
    this.swPublicacion.getUsuarios(6, localStorage.getItem('loginCedula'), 'na', 'na', 'na', 'na').subscribe((data: any) => {
      if (data.success) {
        this.vecRolPersona = data.usuario;
        this.selectRol = this.intRol;
      }
    })
  }
  cambiarRol() {
    this.rutaCambio.navigate([this.config.cambiaRol(this.selectRol)]);
  }
  salirPublicaciones() {
    this.remove();
    //this.router.navigate(['/']);
  }
  public remove() {
    this.casClose.Logout();
    window.sessionStorage.removeItem('ticketUser')
    window.sessionStorage.removeItem('loginUser')
    window.sessionStorage.removeItem('clientName')
  }
}
