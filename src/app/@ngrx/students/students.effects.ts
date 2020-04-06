import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import {Action, createAction} from "@ngrx/store";
import * as StudentsActions from "./students.actions";
import {Observable, of} from "rxjs";
import { switchMap } from "rxjs/operators";
import { StudentsServiceService} from "../../common/services/students.service";
import {catchError, map, retry, skip, startWith} from "rxjs/internal/operators";

@Injectable()
export class StudentsEffects {

  public getStudents$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(StudentsActions.getStudents),
      switchMap(action => this.studentsService.fetchStudents().pipe(
        map(students => StudentsActions.getStudentsSuccess({students})),
        retry(3),
        catchError(error => of(StudentsActions.getStudentsError({error: error})))
      ))
    )
  );
  public deleteStudents$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(StudentsActions.deleteStudent),
      switchMap(action => this.studentsService.removeStudent(action.id).pipe(
        map(students => StudentsActions.deleteStudentSuccess({id: action.id})),
        retry(3),
        catchError(error => of(StudentsActions.deleteStudentError({error: error})))
      ))
    )
  );
  public addStudents$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(StudentsActions.createStudent),
      switchMap(action => this.studentsService.addStudent(action.student).pipe(
        map(student => StudentsActions.createStudentSuccess({student})),
        retry(3),
        catchError(error => of(StudentsActions.createStudentError({error: error})))
      ))
    )
  );
  public searchStudents$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(StudentsActions.searchStudentsBar),
      switchMap(action => this.studentsService.searchStudent(action.searchString).pipe(
        map(studentsArray => StudentsActions.searchStudentsBarSuccess({students: studentsArray})),
        retry(3),
        catchError(error => of(StudentsActions.searchStudentsBarError({error: error})))
      ))
    )
  );

  constructor(
    private actions$: Actions,
    private studentsService: StudentsServiceService
  ) {}

}
