import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import {Action} from "@ngrx/store";
import * as MarksActions from "./marks.actions";
import {Observable, of} from "rxjs";
import { switchMap } from "rxjs/operators";
import {catchError, map, retry} from "rxjs/internal/operators";
import {MarksServiceService} from "../../common/services/marks.service";

@Injectable()
export class MarksEffects {
  public getMarks$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(MarksActions.getMarks),
      switchMap(action => this.marksService.getMarks().pipe(
        map(marks => MarksActions.getMarksSuccess({marks})),
        retry(3),
        catchError(error => of(MarksActions.getMarksError({error: error})))
      ))
    )
  );
  public addNewMark$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(MarksActions.addNewMark),
      switchMap(action => this.marksService.submitMark(action.mark).pipe(
        map(marks => MarksActions.addNewMarkSuccess({mark: marks})),
        retry(3),
        catchError(error => of(MarksActions.addNewMarkError({error: error})))
      ))
    )
  );
  public changeMark: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(MarksActions.changeMark),
      switchMap(action => this.marksService.patchMark(action.mark).pipe(
        map(marks => MarksActions.changeMarkSuccess({mark: marks})),
        retry(3),
        catchError(error => of(MarksActions.changeMarkError({error: error})))
      ))
    )
  );
  public deleteMark: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(MarksActions.deleteMark),
      switchMap(action => {
        return this.marksService.deleteMarks(action.needToDelete.id).pipe(
          map(marks => MarksActions.deleteMarksSuccess()),
          retry(3),
          catchError(error => of(MarksActions.deleteMarksError({error: error})))
        );
      })
    )
  );
  constructor(
    private actions$: Actions,
    private marksService: MarksServiceService
  ) {}

}
