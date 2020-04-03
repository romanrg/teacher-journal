import {State, Action, StateContext, Selector} from "@ngxs/store";
import {GetStudents, DeleteStudent, Students} from "./students.actions";
import {Injectable} from "@angular/core";
import {MarksServiceService} from "../../common/services/marks.service";
import {Marks} from "./marks.actions";
import {catchError, retry, tap} from "rxjs/internal/operators";
import {forkJoin, of} from "rxjs";
import {append, patch, removeItem, updateItem} from "@ngxs/store/operators";
import {Mark} from "../../common/models/IMark";

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
  public createMark({setState, dispatch}: StateContext<MarksStateModel>, {payload}: Mark): void {
    dispatch(new Marks.AddToTheHashTable(payload));
    return setState(patch({
      data: append([payload]),
    }));

  }
  @Action(Marks.CreateError)
  @Action(Marks.Delete)
  public deleteMark({setState, dispatch}: StateContext<MarksStateModel>, {payload}: Mark): void {

    setState(patch({
        data: removeItem(mark => mark.id === payload.id)
    }));
    dispatch(new Marks.RemoveFromTheHashTable(payload));

  }
  @Action(Marks.Patch)
  public patchMark({setState, getState, dispatch}: StateContext<MarksStateModel>, {payload}: Mark): void {
    const getOld: Function = (mark: Mark)
      => mark.subject === payload.subject && mark.student === payload.student && mark.time === payload.time;
    const prePatchMark: Mark  = getState().data.filter(getOld)[0];
    const postPatchMark: Mark = {...payload};
    postPatchMark.id = prePatchMark.id;
    setState(patch({
      data: updateItem(getOld, postPatchMark)
    }));
    dispatch(new Marks.ReplaceInTheHashTable(postPatchMark));
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
    /*
    const batchForPost: Mark[] = [];
    const singularitiesForPut: Mark[] = [];
    this.marksService.getMemory().forEach(mark => mark.id ? singularitiesForPut.push(mark) : batchForPost.push(mark));
    return forkJoin([
      batchForPost.length ? this.marksService.submitMark(batchForPost) : null,
      singularitiesForPut.length ? this.marksService.patchMark(singularitiesForPut) : null
    ]).pipe(
      tap(response => console.log(response))
    )*/

    return forkJoin(this.marksService.getMemory().map(mark => {
      setState(patch({
        loading: true,
        loaded: false
      }));
        if (mark.id) {
          return this.marksService.patchMark(mark);
        } else {
          return this.marksService.submitMark(mark);
        }
      })).pipe(
      tap(apiResponse => {
        this.marksService.clearMemory();
        const newData: Mark[] = [
          ...apiResponse.filter(mark => mark.subject !== null),
          ...getState().data.filter(mark => mark.id)
        ];
        return setState(patch({
          loading: false,
          loaded: true,
          data: newData
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

