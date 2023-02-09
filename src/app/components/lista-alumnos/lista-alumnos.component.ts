import { Component, ElementRef, OnInit } from '@angular/core';

import { AgregarAlumnoDialogComponent } from '../agregar-alumno-dialog/agregar-alumno-dialog.component';
import { Alumno } from '../../interfaces/alumno';
import { EditarAlumnoDialogComponent } from '../editar-alumno-dialog/editar-alumno-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table'

@Component({
  selector: 'app-lista-alumnos',
  templateUrl: './lista-alumnos.component.html',
  styleUrls: ['./lista-alumnos.component.css']
})
export class ListaAlumnosComponent {

  listaAlumnos: Alumno[] = [
    { dni: 123123123, nombre: 'Lionel', apellido: 'Messi', edad: 35, cursoAprobado: true },
    { dni: 222222333, nombre: 'Sergio', apellido: 'Aguero', edad: 30, cursoAprobado: false },
    { dni: 33221111, nombre: 'Leandro', apellido: 'Paredes', edad: 30, cursoAprobado: true },
    { dni: 111223344, nombre: 'Emiliano', apellido: 'Martinez', edad: 32, cursoAprobado: true },
    { dni: 6667754, nombre: 'Nicolas', apellido: 'Otamendi', edad: 29, cursoAprobado: true },
    { dni: 456421, nombre: 'Nicolas', apellido: 'Tagliafico', edad: 28, cursoAprobado: false },
    { dni: 908754, nombre: 'Lautaro', apellido: 'Martinez', edad: 29, cursoAprobado: true },
    { dni: 200715141, nombre: 'Angel', apellido: 'Di Maria', edad: 34, cursoAprobado: false }
  ]

  dataSource: MatTableDataSource<Alumno> = new MatTableDataSource<Alumno>(this.listaAlumnos);

  columnas: string[] = ['DNI', 'Alumno', 'Edad', 'Estado', 'Acciones'];

  constructor(private dialog: MatDialog, private _snackBar: MatSnackBar) { }

  editarAlumno(item: Alumno) {
    const dialogRef = this.dialog.open(EditarAlumnoDialogComponent, {
      data: item
    });

    // Agarro el objeto modificado
    dialogRef.afterClosed().subscribe(result => {

      this.actualizarAlumno(result);

      this._snackBar.open('Información actualizada', 'Cerrar', {
        duration: 2000
      });

    });

  }

  actualizarAlumno(objEditado: Alumno) {

    this.listaAlumnos.forEach(function (itemDeLista) {
      if (itemDeLista.dni === objEditado.dni) {
        itemDeLista.nombre = objEditado.nombre;
        itemDeLista.apellido = objEditado.apellido;
        itemDeLista.edad = objEditado.edad;
        itemDeLista.cursoAprobado = objEditado.cursoAprobado;
      }

    })

    // Actualizo la lista que toma de entrada la tabla
    this.dataSource = new MatTableDataSource<Alumno>(this.listaAlumnos);

  };

  eliminarAlumno(DNIEnviado: number) {

    this.listaAlumnos = this.listaAlumnos.filter(item => this.esDistinto(DNIEnviado, item.dni));

    // Actualizo la lista que toma de entrada la tabla
    this.dataSource = new MatTableDataSource<Alumno>(this.listaAlumnos);

    this._snackBar.open('Alumno eliminado', 'Cerrar', {
      duration: 2000
    });

  }

  esDistinto(dni1: number, dni2: number): boolean {
    return dni1 !== dni2;
  }

  agregarAlumno() {
    const dialogRef = this.dialog.open(AgregarAlumnoDialogComponent, {

    });

    // Agarro el objeto modificado
    dialogRef.afterClosed().subscribe(result => {

      let existeDNI: boolean = false;

      // Si el modal mando algo, me fijo si no existe ya el DNI que quiero agregar
      if (result) {

        existeDNI = this.listaAlumnos.some(element => {
          if (element.dni == result.dni) {
            return true;
          }

          return false;
        });
      }

      // Si el dialog mando algo y EXISTE EL DNI - DNI DUPLICADO
      if (result && existeDNI) {
        this._snackBar.open('DNI duplicado', 'Cerrar', {
          duration: 2000
        });
      }

      // Si el dialog mando algo y NO EXISTE EL DNI - AGREGO
      if (result && !existeDNI) {

        this.listaAlumnos.push(result);

        // Actualizo la lista que toma de entrada la tabla
        this.dataSource = new MatTableDataSource<Alumno>(this.listaAlumnos);

        this._snackBar.open('Alumno agregado', 'Cerrar', {
          duration: 2000
        });
      }

    });
  }

}
