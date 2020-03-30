import { State, Action, StateContext, Selector} from "@ngxs/store";
import {GetStudents, DeleteStudent, Students} from "./students.actions";
import {Injectable} from "@angular/core";
import {MarksServiceService} from "../../common/services/marks-service.service";
import {Marks} from "./marks.actions";
import {catchError, retry, tap} from "rxjs/internal/operators";
import {of} from "rxjs";
import {append, patch, removeItem, updateItem} from "@ngxs/store/operators";

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
      tap(apiResponse => setState({...getState(), data: [...apiResponse], loading: false, loaded: true})),
      retry(3),
      catchError(error => of(dispatch(new Marks.GetError(error))))
    );
  }
  @Action(Marks.GetError)
  public getMarksError({patchState}: StateContext<MarksStateModel>, {payload}: (string | Error)): void {
    patchState({error: payload, loading: false, loaded: false});
  }
  @Action(Marks.Create)
  public createMark({setState, getState, dispatch}: StateContext<MarksStateModel>, {payload}: Mark): void {
    setState({
      ...getState(),
      loading: true,
      loaded: false,
    });
    return this.marksService.submitMark(payload).pipe(
      tap(apiResponse => {
        return setState(
          patch({
            data: append([apiResponse]),
            loading: false,
            loaded: true
          })
        );
      }),
      retry(3),
      catchError(error => of(dispatch(new Marks.CreateError(error))))
    );
  }
  @Action(Marks.CreateError)
  public createMarkError({patchState}: StateContext<MarksStateModel>, {payload}: (string | Error)): void {
    patchState({error: payload, loading: false, loaded: false});
  }
  @Action(Marks.Patch)
  public patchMark({setState, getState, patchState, dispatch}: StateContext<MarksStateModel>, {payload}: Mark): void {
    setState({
      ...getState(),
      loading: true,
      loaded: false,
    });
    const patchTapCb: Function = patched => setState(patch({
      data: updateItem(mark => mark.id === patched.id, patched),
      loading: false,
      loaded: true
    }));
    return this.marksService.patchMark(payload).pipe(
      tap(patchTapCb),
      retry(3),
      catchError(error => of(dispatch(new Marks.PatchError(error))))
    );
  }
  @Action(Marks.PatchError)
  public patchMarkError({patchState}: StateContext<MarksStateModel>, {payload}: (string | Error)): void {
    patchState({error: payload, loading: false, loaded: false});
  }
  @Action(Marks.Change)
  public changeMark({dispatch}: StateContext<MarksStateModel>, {payload}: Mark): void {
    return dispatch(new Marks.Patch(payload));
  }

  @Action(Marks.Delete)
  public deleteMark({setState, getState, dispatch}: StateContext<MarksStateModel>, {payload}: string): void {
    setState({
      ...getState(),
      loading: true,
      loaded: false,
    });
    return this.marksService.deleteMarks(payload).pipe(
      tap(apiResponse => {
        return setState(
          patch({
            data: removeItem(mark => mark.id === payload),
            loading: false,
            loaded: true
          })
        );
      }),
      retry(3),
      catchError(error => of(dispatch(new Marks.DeleteError(error))))
    );
  }

  @Action(Marks.DeleteError)
  public deleteMarkError({patchState}: StateContext<MarksStateModel>, {payload}: (string | Error)): void {
    patchState({error: payload, loading: false, loaded: false});
  }
}

