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

  public addSubjects$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(SubjectsActions.createSubject),
      switchMap(action => this.subjectsService.addSubject(action.subject).pipe(
        map(subjects => {
          return SubjectsActions.createSubjectSuccess({subject: action.subject});
        }),
        catchError(error => SubjectsActions.createSubjectError({error}))
      ))
    )
  );

  public deleteSubjects$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(SubjectsActions.deleteSubject),
      switchMap(action => this.subjectsService.deleteSubject(action.subject).pipe(
        map(subject => {
          return SubjectsActions.deleteSubjectSuccess({subject: action.subject});
        }),
        catchError(error => SubjectsActions.deleteSubjectError({error}))
      ))
    )
  );

  public getCurrentSubject$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(SubjectsActions.addCurrent),
      switchMap(action => this.subjectsService.getSubjectByName(action.current).pipe(
        map(subjects => {
          return SubjectsActions.addCurrentSuccess({subject: subjects[0]});
        }),
        catchError(error => SubjectsActions.getSubjectsError({error}))
      ))
    )
  );
  public changeTeacher$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(SubjectsActions.changeTeacher),
      switchMap(action => this.subjectsService.patchSubject(action.patchedSubject).pipe(
        map(subjects => {
          return SubjectsActions.changeTeacherSuccess({patchedSubject: action.patchedSubject});
        }),
        catchError(error => SubjectsActions.changeTeacherError({error}))
      ))
    )
  );
  /*
  public changeTeacher$: Observable<Action> = createEffect(() => {
    this.actions$.pipe(
      ofType(SubjectsActions.changeTeacher),
      switchMap(action => this.subjectsService.patchSubject(action.patchedSubject).pipe(
        map(subjects => {
          return SubjectsActions.changeTeacherSuccess({patchSubject: patchedSubject});
        }),
        catchError(error => SubjectsActions.changeTeacherError({error}))
      ))
    )
  });
  */
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
