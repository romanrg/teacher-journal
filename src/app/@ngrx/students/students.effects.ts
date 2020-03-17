import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import {Action, createAction} from "@ngrx/store";
import * as StudentsActions from "./students.actions";
import { Observable } from "rxjs";
import { switchMap } from "rxjs/operators";
import { StudentsServiceService} from "../../common/services/students-service.service";
import {catchError, map, tap} from "rxjs/internal/operators";

@Injectable()
export class StudentsEffects {

  public getStudents$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(StudentsActions.getStudents),
      switchMap(action => this.studentsService.fetchStudents().pipe(
        map(students => {
          return StudentsActions.getStudentsSuccess({students})
        }),
        catchError(error => StudentsActions.getStudentsError({error}))
      ))
    )
  );

  public deleteStudents$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(StudentsActions.deleteStudent),
      switchMap(action => this.studentsService.removeStudent(action.id).pipe(
        map(students => {
          return StudentsActions.deleteStudentSuccess({id: action.id});
        }),
        catchError(error => StudentsActions.getStudentsError({error}))
      ))
    )
  );
  public addStudents$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(StudentsActions.createStudent),
      switchMap(action => this.studentsService.addStudent(action.student).pipe(
        map(students => {
          return StudentsActions.createStudentSuccess(action.student);
        }),
        catchError(error => StudentsActions.createStudentError({error}))
      ))
    )
  );


  constructor(
    private actions$: Actions,
    private studentsService: StudentsServiceService
  ) {
    console.log("[STUDENTS EFFECTS]");
  }

}
