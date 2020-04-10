import {State, Action, StateContext, Selector} from "@ngxs/store";
import {GetStudents, DeleteStudent, Students} from "./students.actions";
import {Injectable} from "@angular/core";
import {MarksServiceService} from "../../common/services/marks.service";
import {Marks} from "./marks.actions";
import {catchError, retry, tap} from "rxjs/internal/operators";
import {forkJoin, of} from "rxjs";
import {append, patch, removeItem, updateItem} from "@ngxs/store/operators";
import {Mark} from "../../common/models/IMark";
import {_allPass, _allTrue, _compose, copyByJSON} from "../../common/helpers/lib";
import {Equalities} from "../../common/models/filters";

export class MarksStateModel {
  public data: Mark[];
  public loading: boolean;
  public loaded: boolean;
  public error: null|(string|Error);
}

@State<MarksStateModel>({
  name: "marks",
  defaults: {
    data: [],
    loading: true,
    loaded: false,
    error: null
  }
})
@Injectable({
  providedIn: "root"
})
export class NgxsMarksState {
  public equalMark: Equalities.Marks = Equalities.Marks;
  constructor(
    private marksService: MarksServiceService
  ) {}

  @Selector()
  public static Marks(state: MarksStateModel): MarksStateModel {
    return state;
  }

  @Action(Marks.Get)
  public getMarks({getState, setState, dispatch}: StateContext<MarksStateModel>): void {
    setState({
      ...getState(),
      loading: true,
      loaded: false,
    });
    return this.marksService.getMarks().pipe(
      tap(apiResponse => {
        apiResponse.forEach(mark => mark.id = mark._id);
        return setState({...getState(), data: [...apiResponse.flat(1)].filter(({subject}) => subject !== null), loading: false, loaded: true});
      }),
      retry(3),
      catchError(error => of(dispatch(new Marks.GetError(error))))
    );
  }
  @Action(Marks.GetError)
  public getMarksError({patchState}: StateContext<MarksStateModel>, {payload}: (string | Error)): void {
    patchState({error: payload, loading: false, loaded: false});
  }
  @Action(Marks.Create)
  public createMark({setState, dispatch, getState}: StateContext<MarksStateModel>, {payload}: Mark): void {
    dispatch(new Marks.AddToTheHashTable(payload));
    return setState(patch({
      data: append([payload]),
    }));

  }
  @Action(Marks.Delete)
  public deleteMark({setState, dispatch}: StateContext<MarksStateModel>, {payload}: Mark): void {
    console.log(payload);
    setState(patch({
        data: removeItem(mark => mark.id === payload.id)
    }));
    dispatch(new Marks.RemoveFromTheHashTable(payload));

  }
  @Action(Marks.Patch)
  public patchMark({setState, getState, dispatch}: StateContext<MarksStateModel>, {payload}: Mark): void {
    const newData: Mark[] = copyByJSON(getState().data);
    const index: number = newData.findIndex(this.equalMark(payload));
    newData[index].value = payload.value;
    setState({
      data: newData
    });
    dispatch(new Marks.ReplaceInTheHashTable(newData[index]));
  }

  @Action(Marks.PatchError)
  public patchMarkError({patchState}: StateContext<MarksStateModel>, {payload}: (string | Error)): void {
    patchState({error: payload, loading: false, loaded: false});
  }
  @Action(Marks.Change)
  public changeMark({dispatch}: StateContext<MarksStateModel>, {payload}: Mark): void {
    return dispatch(new Marks.Patch(payload));
  }
  @Action(Marks.DeleteError)
  public deleteMarkError({patchState}: StateContext<MarksStateModel>, {payload}: (string | Error)): void {
    patchState({error: payload, loading: false, loaded: false});
  }
  @Action (Marks.AddToTheHashTable)
  public addToTheHash(ctx, {payload}: Mark): void {
    return this.marksService.addHash(payload);
  }
  @Action (Marks.RemoveFromTheHashTable)
  public removeFromHash(ctx, {payload}: Mark): void {
    this.marksService.removeHash(payload);
  }

  @Action(Marks.ReplaceInTheHashTable)
  public replaceInTheHash(ctx, {payload}: Mark): void {
    this.marksService.replaceHash(payload);
  }

  @Action(Marks.Submit)
  public submitMarks({getState, setState, dispatch}: StateContext<MarksStateModel>): void {
    setState(patch({
      loading: true,
      loaded: false
    }));
    return this.marksService.submitMark(this.marksService.getMemory()).pipe(
      tap(this.marksService.clearMemory),
      tap((apiResponse: Mark[]) => {
        apiResponse.map(mark => mark.id = mark._id);
        const newData: Mark[] = [
          ...apiResponse.filter(mark => mark.subject !== null),
          ...getState().data.filter(mark => mark.id)
        ];
        return setState(patch({
          loading: false,
          loaded: true,
          data: newData,
        }));
      }),
      retry(3),
      catchError(error => dispatch(new Marks.SubmitError(error)))
    );
  }

  @Action(Marks.SubmitError)
  public submitMarksError({patchState}: StateContext<MarksStateModel>, {payload}: (string | Error)): void {
    return patchState({
      error: payload
    });
  }
}

