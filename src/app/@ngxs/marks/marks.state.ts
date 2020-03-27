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
    loading: false,
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
    return this.marksService.getMarks().pipe(
      tap(apiResponse => setState({...getState(), data: [...apiResponse]})),
      retry(3),
      catchError(error => of(dispatch(new Marks.GetError(error))))
    );
  }
  @Action(Marks.GetError)
  public getMarksError({getState, setState}: StateContext<MarksStateModel>, {payload}: (string | Error)): void {
    console.log(payload, "ERROR GET MARKS");
  }
  @Action(Marks.Create)
  public createMark({setState, dispatch}: StateContext<MarksStateModel>, {payload}: Mark): void {
    return this.marksService.submitMark(payload).pipe(
      tap(apiResponse => {
        return setState(
          patch({
            data: append([apiResponse])
          })
        );
      }),
      retry(3),
      catchError(error => of(dispatch(new Marks.CreateError(error))))
    );
  }
  @Action(Marks.CreateError)
  public createMarkError({getState, setState}: StateContext<MarksStateModel>, {payload}: (string | Error)): void {
    console.log(payload, "ERROR");
  }
  @Action(Marks.Patch)
  public patchMark({getState, setState, dispatch}: StateContext<MarksStateModel>, {payload}: Mark): void {
    const patchTapCb: Function = patched => setState(patch({data: updateItem(mark => mark.id === patched.id, patched)}))
    return this.marksService.patchMark(payload).pipe(
      tap(patchTapCb),
      retry(3),
      catchError(error => of(dispatch(new Marks.PatchError(error))))
    );
  }
  @Action(Marks.PatchError)
  public patchMarkError({getState, setState}: StateContext<MarksStateModel>, {payload}: (string | Error)): void {
    console.log(payload, "ERROR");
  }
  @Action(Marks.Change)
  public changeMark({getState, setState, dispatch}: StateContext<MarksStateModel>, {payload}: Mark): void {
    return dispatch(new Marks.Patch(payload));
  }

  @Action(Marks.Delete)
  public deleteMark({setState, dispatch}: StateContext<MarksStateModel>, {payload}: string): void {
    return this.marksService.deleteMarks(payload).pipe(
      tap(apiResponse => {
        return setState(
          patch({
            data: removeItem(mark => mark.id === payload)
          })
        );
      }),
      retry(3),
      catchError(error => of(dispatch(new Marks.DeleteError(error))))
    );
  }

  @Action(Marks.DeleteError)
  public deleteMarkError({getState, setState}: StateContext<MarksStateModel>, {payload}: (string | Error)): void {
    console.log(payload, "ERROR");
  }
}

