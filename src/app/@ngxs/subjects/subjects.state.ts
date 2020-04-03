import {State, Action, StateContext, Selector, NgxsOnChanges, NgxsSimpleChange} from "@ngxs/store";
import {catchError, retry, tap} from "rxjs/internal/operators";
import {Injectable} from "@angular/core";
import {of} from "rxjs";
import {ISubject} from "../../common/models/ISubject";
import {SubjectsService} from "../../common/services/subjects.service";
import {Subjects} from "./subjects.actions";
import {IStudent} from "../../common/models/IStudent";
import {StudentsStateModel} from "../students/students.state";
import {Mark} from "../../common/models/IMark";
import {append, iif, patch, removeItem, updateItem} from "@ngxs/store/operators";
import {Marks} from "../marks/marks.actions";
import {Students} from "../students/students.actions";
import {MarksServiceService} from "../../common/services/marks-service.service";

export class SubjectsStateModel {
  public data: ISubject[];
  public loading: boolean;
  public loaded: boolean;
  public paginationConstant: number;
  public currentPage: number;
  public error: string|Error;
}

export class SubjectTableState implements SubjectsStateModel{
  public students: IStudent[];
  public marks: Mark[];
  public sortedColumn: {col: number, times: number}|null;
}


@State<SubjectsStateModel>({
  name: "subjects",
  defaults: {
    data: [],
    loading: true,
    loaded: false,
    paginationConstant: 5,
    currentPage: 1,
    sortedColumn: null,
    renderMap: null,
    error: null
  }
})
@Injectable({
  providedIn: "root"
})
export class NgxsSubjectsState implements NgxsOnChanges{

  constructor(
    private subjectsService: SubjectsService,
  ) {}

  @Selector()
  public static Subjects(state: SubjectsStateModel): SubjectsStateModel {
    return state;
  }
  @Action(Subjects.Get)
  public getSubjects({getState, setState, dispatch}: StateContext<SubjectsStateModel>): void {
    setState({
      ...getState(),
      loading: true,
      loaded: false,
    });
    return this.subjectsService.fetchSubjects().pipe(
      tap(apiResponse => setState({...getState(),   data: [...apiResponse], loading: false, loaded: true})),
      retry(3),
      catchError(error => of(dispatch(new Subjects.GetError(error))))
    );
  }
  @Action(Subjects.GetError)
  public subjectsGetError({patchState}: StateContext<SubjectsStateModel>, {payload}: (string|Error)): void {
    patchState({error: payload, loading: false, loaded: false});
  }

  @Action(Subjects.Create)
  public createSubject({setState, getState, dispatch}: StateContext<SubjectsStateModel>, {payload}: ISubject): void {
    setState({
      ...getState(),
      loading: true,
      loaded: false,
    });
    return this.subjectsService.addSubject(payload).pipe(
      tap(apiResponse => {
        return setState(
          patch({
            data: append([apiResponse]),
            loading: false, loaded: true
          })
        );
      }),
      retry(3),
      catchError(error => of(dispatch(new Subjects.CreateError(error))))
    );
  }
  @Action(Subjects.CreateError)
  public createSubjectError({patchState}: StateContext<SubjectsStateModel>, {payload}: (string | Error)): void {
    patchState({error: payload, loading: false, loaded: false});
  }

  @Action(Subjects.Delete)
  public deleteSubject({getState, setState, dispatch}: StateContext<SubjectsStateModel>, {payload}: string): void {
    setState({
      ...getState(),
      loading: true,
      loaded: false,
    });
    const deletedSubject: ISubject = getState().data.filter(subj => subj.name === payload)[0];
    return this.subjectsService.deleteSubject(deletedSubject.id).pipe(
      tap(deleteResponse => {
          setState(patch({
            data: removeItem(subj => subj.name === payload),
            loading: false, loaded: false
          }));
        }
      ),
      retry(3),
      catchError(error => of(dispatch(new Subjects.DeleteError(error))))
    );
  }
  @Action(Subjects.DeleteError)
  public deleteError({patchState}: StateContext<SubjectsStateModel>, {payload}: (string | Error)): void {
    patchState({error: payload, loading: false, loaded: false});
  }

  @Action(Subjects.ChangeCurrentPage)
  public changeCurrent({setState}: StateContext<SubjectsStateModel>, {payload}: number): void {
    return setState(state => ({...state, currentPage: payload}));
  }
  @Action(Subjects.ChangePagination)
  public changePagination({setState}: StateContext<SubjectsStateModel>, {payload}: number): void {
      return setState(state => ({...state, paginationConstant: payload}));
  }

  @Action(Subjects.AddDate)
  public addNewDate({dispatch}: StateContext<SubjectsStateModel>, {payload}: ISubject): void {
    return dispatch(new Subjects.Update(payload));
  }
  @Action(Subjects.ChangeTeacher)
  public changeTeacher({dispatch}: StateContext<SubjectsStateModel>, {payload}: ISubject): void {
    return dispatch(new Subjects.Update(payload));
  }
  @Action(Subjects.DeleteDate)
  public deleteDate({dispatch}: StateContext<SubjectsStateModel>, {subject, marks}: ISubject): void {
    dispatch(new Subjects.Update(subject));
    marks.forEach(mark => {
      dispatch(new Marks.Delete(mark));
    });
  }
  @Action(Subjects.Patch)
  public patchSubject({setState, getState, dispatch}: StateContext<SubjectsStateModel>, {payload}: ISubject): void {
    setState({
      ...getState(),
      loading: true,
      loaded: false,
    });
    const patchTapCb: Function = patchedSubject => setState(
      patch(
        {
          loading: false, loaded: true
        }
      )
    );
    return this.subjectsService.patchSubject(payload).pipe(
      tap(patchTapCb),
      retry(3),
      catchError(error => of(dispatch(new Subjects.PatchError(error))))
    );

  }
  @Action(Subjects.PatchError)
  public patchSubjectError({patchState}: StateContext<StudentsStateModel>, {payload}: (string | Error)): void {
    patchState({error: payload, loading: false, loaded: false});
  }

  @Action(Subjects.SetSortedColumn)
  public setSortedColumn({getState, setState, dispatch}: StateContext<SubjectsStateModel>, {payload}: number): void {
    const state: SubjectTableState = getState();
    if (state.sortedColumn === null) {
      setState(patch({sortedColumn: {col: payload, times: 1}}));
    } else {
      const times: number = state.sortedColumn.times + 1;
      state.sortedColumn.col === payload ?
        setState(patch({sortedColumn: {col: payload, times}})) :
        setState(patch({sortedColumn: {col: payload, times: 1}}));
    }
  }


  @Action(Subjects.Update)
  public keepSubjectUpdated({setState}: StateContext<SubjectsStateModel>, {payload}: ISubject): void {
    this.subjectsService.updateSubjectState(payload);
    setState(patch({
      data: updateItem(subj => subj.id === payload.id, payload)
    }));
  }

  @Action(Subjects.Submit)
  public submitChanges({dispatch}: StateContext<SubjectsStateModel>): void {
    if (this.subjectsService.subjectToUpdate) {
      dispatch(new Subjects.Patch(this.subjectsService.subjectToUpdate));
      this.subjectsService.updateSubjectState(undefined);
    }
    // post new marks update;
    dispatch(new Marks.Submit());

  }

}
