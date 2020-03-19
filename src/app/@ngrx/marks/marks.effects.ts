import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import {Action, createAction} from "@ngrx/store";
import * as MarksActions from "./marks.actions";
import { Observable } from "rxjs";
import { switchMap } from "rxjs/operators";
import {catchError, map, skip, startWith} from "rxjs/internal/operators";
import {MarksServiceService} from "../../common/services/marks-service.service";

@Injectable()
export class MarksEffects {
  public getMarks$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(MarksActions.getMarks),
      switchMap(action => this.marksService.getMarks().pipe(
        map(marks => {
          return MarksActions.getMarksSuccess({marks});
        }),
        catchError(error => MarksActions.getMarksError({error}))
      ))
    )
  );
  /*
  public getStudents$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(StudentsActions.getStudents),
      switchMap(action => this.studentsService.fetchStudents().pipe(
        map(students => {
          return StudentsActions.getStudentsSuccess({students});
        }),
        catchError(error => StudentsActions.getStudentsError({error}))
      ))
    )
  );

  public getStudentsForSubject$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(StudentsActions.getStudentsForSubjects),
      switchMap(action => this.studentsService.fetchStudents().pipe(
        map(students => {
          return StudentsActions.getStudentsSuccess({students});
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
  public searchStudents$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(StudentsActions.searchStudentsBar),
      switchMap(action => this.studentsService.searchStudent(action.searchString).pipe(
        map(studentsArray => {
          return StudentsActions.searchStudentsBarSuccess({students: studentsArray});
        })
      ))
    )
  );
  */
  constructor(
    private actions$: Actions,
    private marksService: MarksServiceService
  ) {
    console.log("[MARKS EFFECTS]");
  }

}
