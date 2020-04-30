import {State, Action, StateContext, Selector, StateOperator} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {MarksServiceService} from "../../common/services/marks.service";
import {Marks} from "./marks.actions";
import {catchError, retry, tap} from "rxjs/internal/operators";
import {Observable, of} from "rxjs";
import {append, patch, removeItem} from "@ngxs/store/operators";
import {Mark} from "../../common/models/IMark";
import {copyByJSON} from "../../common/helpers/lib";
import {Equalities} from "../../common/models/filters";
import {Statistics} from "../statistics/statistics.actions";

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
  public equalMark: Function = Equalities.Marks;
  constructor(
    private marksService: MarksServiceService
  ) {}

  @Selector()
  public static Marks(state: MarksStateModel): MarksStateModel {
    return state;
  }

  @Action(Marks.Get)
  public getMarks({getState, setState, dispatch}: StateContext<MarksStateModel>): Observable<Observable<void> | Mark[]> {
    setState({
      ...getState(),
      loading: true,
      loaded: false,
    });
    return this.marksService.getMarks().pipe(
      tap(apiResponse => {
        apiResponse.forEach(mark => mark.id = mark._id);
        const marks: Mark[] = [...(<Array<Mark>>apiResponse).flat(1)].filter(({subject}) => subject !== null);
        dispatch(new Statistics.SetMarks(marks));
        return setState({...getState(), data: marks, loading: false, loaded: true});
      }),
      retry(3),
      catchError(error => of(dispatch(new Marks.GetError(error))))
    );
  }
  @Action(Marks.GetError)
  public getMarksError({patchState}: StateContext<MarksStateModel>, {payload}: any): void {
    patchState({error: payload, loading: false, loaded: false});
  }
  @Action(Marks.Create)
  public createMark({setState, dispatch, getState}: StateContext<MarksStateModel>, {payload}: any): MarksStateModel {
    dispatch(new Marks.AddToTheHashTable(payload));
    return setState(patch({
      data: append([payload]),
    }));

  }
  @Action(Marks.Delete)
  public deleteMark({setState, dispatch}: StateContext<MarksStateModel>, {payload}: any): void {

    setState(patch({
        data: removeItem(mark => mark.id === payload.id)
    }));
    dispatch(new Marks.RemoveFromTheHashTable(payload));


  }
  @Action(Marks.Patch)
  public patchMark({setState, getState, dispatch}: StateContext<MarksStateModel>, {payload}: any): void {
    const newData: Mark[] = copyByJSON(getState().data);
    const index: number = newData.findIndex(this.equalMark(payload));
    newData[index].value = payload.value;
    setState({
        ...getState(),
      data: newData
    });
    dispatch(new Marks.ReplaceInTheHashTable(newData[index]));
  }

  @Action(Marks.PatchError)
  public patchMarkError({patchState}: StateContext<MarksStateModel>, {payload}: any): void {
    patchState({error: payload, loading: false, loaded: false});
  }
  @Action(Marks.Change)
  public changeMark({dispatch}: StateContext<MarksStateModel>, {payload}: any): Observable<void> {
    return dispatch(new Marks.Patch(payload));
  }
  @Action(Marks.DeleteError)
  public deleteMarkError({patchState}: StateContext<MarksStateModel>, {payload}: any): void {
    patchState({error: payload, loading: false, loaded: false});
  }
  @Action (Marks.AddToTheHashTable)
  public addToTheHash(ctx, {payload}: any): void {
    return this.marksService.addHash(payload);
  }
  @Action (Marks.RemoveFromTheHashTable)
  public removeFromHash(ctx, {payload}: any): void {
    this.marksService.removeHash(payload);
  }

  @Action(Marks.ReplaceInTheHashTable)
  public replaceInTheHash(ctx, {payload}: any): void {
    this.marksService.replaceHash(payload);
  }

  @Action(Marks.Submit)
  public submitMarks({getState, setState, dispatch}: StateContext<MarksStateModel>): Observable<void | Mark[]> {
    setState(<MarksStateModel | StateOperator<MarksStateModel>>patch({
      loading: true,
      loaded: false
    }));
    return this.marksService.submitMark(<Mark[]>Object.values(this.marksService.getMemory())).pipe(
      tap(this.marksService.clearMemory),
      tap((apiResponse: Mark[]) => {
        apiResponse.map(mark => mark.id = mark._id);
        const newData: Mark[] = [
          ...apiResponse.filter(mark => mark.subject !== null),
          ...getState().data.filter(mark => mark.id)
        ];
        return setState(<MarksStateModel | StateOperator<MarksStateModel>>patch({
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
  public submitMarksError({patchState}: StateContext<MarksStateModel>, {payload}: any): MarksStateModel {
    return patchState({
      error: payload
    });
  }
}

