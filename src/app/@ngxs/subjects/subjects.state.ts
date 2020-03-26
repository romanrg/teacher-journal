import { State, Action, StateContext, Selector} from "@ngxs/store";
import {catchError, retry, tap} from "rxjs/internal/operators";
import {Injectable} from "@angular/core";
import {of} from "rxjs";
import {ISubject} from "../../common/models/ISubject";
import {SubjectsService} from "../../common/services/subjects.service";
import {Subjects} from "./subjects.actions";

export class SubjectsStateModel {
  public data: ISubject[];
  public loading: boolean;
  public loaded: boolean;
  public paginationConstant: number;
  public currentPage: number;
}

@State<SubjectsStateModel>({
  name: "subjects",
  defaults: {
    data: [],
    loading: false,
    loaded: false,
    paginationConstant: 5,
    currentPage: 1
  }
})
@Injectable({
  providedIn: "root"
})
export class NgxsSubjectsState {

  constructor(
    private subjectsService: SubjectsService
  ) {}

  @Selector()
  public static Subjects(state: SubjectsStateModel): SubjectsStateModel {
    return state;
  }
  @Action(Subjects.Get)
  public getSubjects({getState, setState, dispatch}: StateContext<SubjectsStateModel>): void {
    return this.subjectsService.fetchSubjects().pipe(
      tap(apiResponse => setState({...getState(),   data: [...apiResponse], loaded: true})),
      retry(3),
      catchError(error => of(dispatch(new Subjects.GetError(error))))
    );
  }
  @Action(Subjects.GetError)
  public subjectsGetError({getState, setState}: StateContext<SubjectsStateModel>, {payload}: (string|Error)): void {
      console.log(payload, "ERROR GET");
  }

  @Action(Subjects.Create)
  public createSubject({getState, patchState, dispatch}: StateContext<SubjectsStateModel>, {payload}: ISubject): void {
    const state: SubjectsStateModel = getState();
    return this.subjectsService.addSubject(payload).pipe(
      tap(apiResponse => {
        patchState({
          data: [...state.data].concat(apiResponse)
        });
      }),
      retry(3),
      catchError(error => of(dispatch(new Subjects.CreateError(error))))
    );
  }
  @Action(Subjects.CreateError)
  public createSubjectError({getState, setState}: StateContext<SubjectsStateModel>, {payload}: (string | Error)): void {
    console.log(payload, "ERROR CREATE");
  }

  @Action(Subjects.Delete)
  public deleteSubject({getState, setState, dispatch}: StateContext<SubjectsStateModel>, {payload}: string): void {
    const deletedSubject: ISubject = getState().data.filter(subj => subj.name === payload)[0];
    return this.subjectsService.deleteSubject(deletedSubject.id).pipe(
      tap(deleteResponse => {
          setState({
            ...getState(),
            data: getState().data.filter(subj => subj.id !== deletedSubject.id)
          })
        }
      ),
      retry(3),
      catchError(error => of(dispatch(new Subjects.DeleteError(error))))
    );
  }
  @Action(Subjects.DeleteError)
  public deleteError({getState, setState}: StateContext<SubjectsStateModel>, {payload}: (string | Error)): void {
    console.log(payload, "ERROR DELETE");
  }

  @Action(Subjects.ChangeCurrentPage)
  public changeCurrent({setState}: StateContext<SubjectsStateModel>, {payload}: number): void {
    setState(state => ({...state, currentPage: payload}));
  }
  @Action(Subjects.ChangePagination)
  public changePagination({setState}: StateContext<SubjectsStateModel>, {payload}: number): void {
      setState(state => ({...state, paginationConstant: payload}));
  }

}

