import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import {Action, createAction} from "@ngrx/store";
import * as SubjectsActions from "./subjects.actions";
import {Observable, of} from "rxjs";
import { switchMap } from "rxjs/operators";
import {catchError, map, retry, skip, startWith} from "rxjs/internal/operators";
import {SubjectsService} from "../../common/services/subjects.service";
import {ISubject} from "../../common/models/ISubject";

@Injectable()
export class SubjectsEffects {

  public getSubjects$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(SubjectsActions.getSubjects),
      switchMap(action => this.subjectsService.fetchSubjects().pipe(
        map(subjects => SubjectsActions.getSubjectsSuccess({subjects})),
        retry(3),
        catchError(error => of(SubjectsActions.getSubjectsError({error: error})))
      ))
    )
  );

  public addSubjects$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(SubjectsActions.createSubject),
      switchMap(action => this.subjectsService.addSubject(action.subject).pipe(
        map(subject => SubjectsActions.createSubjectSuccess({subject})),
        retry(3),
        catchError(error => of(SubjectsActions.createSubjectError({error: error})))
      ))
    )
  );

  public deleteSubjects$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(SubjectsActions.deleteSubject),
      switchMap(action => this.subjectsService.deleteSubject(action.subject).pipe(
        map(subject => SubjectsActions.deleteSubjectSuccess({subject: action.subject})),
        retry(3),
        catchError(error => of(SubjectsActions.deleteSubjectError({error: error})))
      ))
    )
  );
  public changeTeacher$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(SubjectsActions.changeTeacher),
      switchMap(action => this.subjectsService.patchSubject(action.patchedSubject).pipe(
        map(subjects => SubjectsActions.changeTeacherSuccess({patchedSubject: subjects})),
        retry(3),
        catchError(error => of(SubjectsActions.changeTeacherError({error: error})))
      ))
    )
  );
  public addNewUniqueDate$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(SubjectsActions.addNewUniqueDate),
      switchMap(action => this.subjectsService.patchSubject(action.subject).pipe(
        map(subject => SubjectsActions.addNewUniqueDateSuccess({subject: subject})),
        retry(3),
        catchError(error => of(SubjectsActions.addNewUniqueDateError({error: error})))
      ))
    )
  );
  public deleteUnique$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(SubjectsActions.deleteDate),
      switchMap(action => {
        const patched: ISubject = JSON.parse(JSON.stringify(action.subject));
        patched.uniqueDates = patched.uniqueDates.filter(ts => ts !== action.timestamp);
        return this.subjectsService.patchSubject(patched).pipe(
          map(subject => SubjectsActions.deleteDateSuccess({subject})),
          retry(3),
          catchError(error => of(SubjectsActions.deleteDateError({error: error})))
        );
      })
    )
  );
  constructor(
    private actions$: Actions,
    private subjectsService: SubjectsService
  ) {}

}
