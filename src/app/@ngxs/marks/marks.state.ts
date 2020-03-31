import {State, Action, StateContext, Selector, getValue} from "@ngxs/store";
import {GetStudents, DeleteStudent, Students} from "./students.actions";
import {Injectable} from "@angular/core";
import {MarksServiceService} from "../../common/services/marks-service.service";
import {Marks} from "./marks.actions";
import {catchError, retry, tap} from "rxjs/internal/operators";
import {forkJoin, of} from "rxjs";
import {append, patch, removeItem, updateItem} from "@ngxs/store/operators";
import {SubjectsService} from "../../common/services/subjects.service";
import {Subjects} from "../subjects/subjects.actions";
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
        return setState({...getState(), data: [...apiResponse].filter(({subject}) => subject !== null), loading: false, loaded: true});
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
  public createMark({setState, getState, dispatch}: StateContext<MarksStateModel>, {payload}: Mark): void {
    dispatch(new Marks.AddToTheHashTable(payload));
    setState(patch({
      data: append([payload]),
    }));
    /*
    setState({
      ...getState(),
      loading: true,
      loaded: false,
    });
    */
    /*
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
    */
  }
  @Action(Marks.CreateError)

  @Action(Marks.Delete)
  public deleteMark({setState, getState, dispatch}: StateContext<MarksStateModel>, {payload}: Mark): void {
    /*
    setState({
      ...getState(),
      loading: true,
      loaded: false,
    });
    */
    setState(patch({
        data: removeItem(mark => mark.id === payload.id)
    }));
    dispatch(new Marks.RemoveFromTheHashTable(payload));
    /*
    return this.marksService.deleteMarks(payload.id).pipe(
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
    */
  }
  @Action(Marks.Patch)
  public patchMark({setState, getState, dispatch}: StateContext<MarksStateModel>, {payload}: Mark): void {
    const getOld: Function = mark => mark.subject === payload.subject && mark.student === payload.student && mark.time === payload.time;
    const prePatchMark: Mark  = getState().data.filter(getOld)[0];
    const postPatchMark: Mark = {...payload};
    setState(patch({
      data: updateItem(getOld, postPatchMark)
    }));
    console.log("Payload:", payload, "prePatchMark:",prePatchMark, "postPatchMark:",postPatchMark, "getState:",getState());
    dispatch(new Marks.ReplaceInTheHashTable(postPatchMark));
  }


  public createMarkError({patchState}: StateContext<MarksStateModel>, {payload}: (string | Error)): void {
    patchState({error: payload, loading: false, loaded: false});
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
  public addToTheHash(ctx: StateContext<MarksStateModel>, {payload}: Mark): void {
    this.marksService.addHash(payload);
  }
  @Action (Marks.RemoveFromTheHashTable)
  public removeFromHash(ctx: StateContext<MarksStateModel>, {payload}: Mark): void {
    this.marksService.removeHash(payload);
  }

  @Action(Marks.ReplaceInTheHashTable)
  public replaceInTheHash({getState, setState, dispatch}: StateContext<MarksStateModel>, {payload}: Mark): void {
    this.marksService.replaceHash(payload);
  }

  @Action(Marks.Submit)
  public submitMarks({getState, setState, dispatch}: StateContext<MarksStateModel>): void {
    return forkJoin(this.marksService.getMemory().map(mark => {
      setState(patch({
        loading: true,
        loaded: false
      }));
        if (mark.id) {
          return this.marksService.patchMark(mark)
        } else {
          return this.marksService.submitMark(mark)
        }
      })).pipe(
      tap(apiResponse => {
        this.marksService.clearMemory();
        return setState(patch({
          loading: false,
          loaded: true
        }));
      }),
      retry(3),
      catchError(error => console.log(error)/*dispatch new Error response*/)
    );
  }
}

