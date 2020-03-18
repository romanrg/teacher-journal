import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import {Action, createAction} from "@ngrx/store";
import * as SubjectsActions from "./subjects.actions";
import { Observable } from "rxjs";
import { switchMap } from "rxjs/operators";
import {catchError, map, skip, startWith} from "rxjs/internal/operators";
import {SubjectsService} from "../../common/services/subjects.service";

@Injectable()
export class SubjectsEffects {

  public getSubjects$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(SubjectsActions.getSubjects),
      switchMap(action => this.subjectsService.fetchSubjects().pipe(
        map(subjects => {
          return SubjectsActions.getSubjectsSuccess({subjects});
        }),
        catchError(error => SubjectsActions.getSubjectsError({error}))
      ))
    )
  );

  /*
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
    private subjectsService: SubjectsService
  ) {
    console.log("[SUBJECTS EFFECTS]");
  }

}
