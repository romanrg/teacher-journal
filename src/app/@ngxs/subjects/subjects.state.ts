import {State, Action, StateContext, Selector, NgxsOnChanges, NgxsSimpleChange, StateOperator} from "@ngxs/store";
import {catchError, retry, tap} from "rxjs/internal/operators";
import {Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import {ISubject} from "../../common/models/ISubject";
import {SubjectsService} from "../../common/services/subjects.service";
import {Subjects} from "./subjects.actions";
import {IStudent} from "../../common/models/IStudent";
import {StudentsStateModel} from "../students/students.state";
import {Mark} from "../../common/models/IMark";
import {append, iif, patch, removeItem, updateItem} from "@ngxs/store/operators";
import {Marks} from "../marks/marks.actions";
import {Students} from "../students/students.actions";
import {MarksServiceService} from "../../common/services/marks.service";
import {Statistics} from "../statistics/statistics.actions";

export class SubjectsStateModel {
  public data: ISubject[];
  public loading: boolean;
  public loaded: boolean;
  public paginationConstant: number;
  public currentPage: number;
  public error: string|Error;
  public popups: {list: {}|null, table: {}|null};
  public students: IStudent[];
  public marks: Mark[];
  public sortedColumn: {col: number, times: number}|null;
  public renderMap: null;
  public current: ISubject;
}


@State<SubjectsStateModel>({
  name: "subjects",
  defaults: {
    students: [],
    marks: [],
    data: [],
    loading: true,
    loaded: false,
    paginationConstant: 5,
    currentPage: 1,
    sortedColumn: null,
    renderMap: null,
    error: null,
    popups: {list: null, table: null},
    current: null,
  }
})
@Injectable({
  providedIn: "root"
})
export class NgxsSubjectsState {

  constructor(
    private subjectsService: SubjectsService,
  ) {}

  @Selector()
  public static Subjects (state: SubjectsStateModel): SubjectsStateModel { return state; }

  @Action(Subjects.Get)
  public getSubjects({getState, setState, dispatch}: StateContext<SubjectsStateModel>): Observable<Observable<void> | ISubject[]> {

    setState({
      ...getState(),
      loading: true,
      loaded: false,
    });

    return this.subjectsService.fetchSubjects().pipe(
      tap(apiResponse => {
        apiResponse.forEach(subject => subject.id = subject._id);
        dispatch(new Statistics.SetSubjects(apiResponse));
        return setState({...getState(),   data: [...apiResponse], loading: false, loaded: true})
      }),
      retry(3),
      catchError(error => of(dispatch(new Subjects.GetError(error))))
    );

  }
  @Action(Subjects.GetError)
  public subjectsGetError({patchState}: StateContext<SubjectsStateModel>, {payload}: any): void {

    patchState({error: payload, loading: false, loaded: false});

  }

  @Action(Subjects.Create)
  public createSubject({setState, getState, dispatch}: StateContext<SubjectsStateModel>, {payload}: any): Observable<Observable<void> | ISubject> {

    setState({
      ...getState(),
      loading: true,
      loaded: false,
    });

    return this.subjectsService.addSubject(payload).pipe(
      tap(apiResponse => {
        apiResponse.id = apiResponse._id;
        return setState(
          <SubjectsStateModel | StateOperator<SubjectsStateModel>>patch({
            popups: {list: {type: "success", value: `${apiResponse.name}`, action: "add"}, table: getState().popups.table},
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
  public createSubjectError({patchState}: StateContext<SubjectsStateModel>, {payload}: any): void {

    patchState({error: payload, loading: false, loaded: false});

  }

  @Action(Subjects.Delete)
  public deleteSubject({getState, setState, dispatch}: StateContext<SubjectsStateModel>, {payload}: any): Observable<Object | Observable<void>> {

    setState({
      ...getState(),
      loading: true,
      loaded: false,
    });

    const deletedSubject: ISubject = getState().data.filter(subj => subj.name === payload)[0];

    return this.subjectsService.deleteSubject(deletedSubject.id).pipe(
      tap(deleteResponse => {
          setState(<SubjectsStateModel | StateOperator<SubjectsStateModel>>patch({
            popups: {list: {type: "success", value: `${deletedSubject.name}`, action: "delete"}, table: getState().popups.table},
            data: removeItem((subj: ISubject) => subj.name === payload),
            loading: false, loaded: false
          }));
        }
      ),
      retry(3),
      catchError(error => of(dispatch(new Subjects.DeleteError(error))))
    );

  }
  @Action(Subjects.DeleteError)
  public deleteError({patchState}: StateContext<SubjectsStateModel>, {payload}: any): void {

    patchState({error: payload, loading: false, loaded: false});

  }

  @Action(Subjects.ChangeCurrentPage)
  public changeCurrent({setState}: StateContext<SubjectsStateModel>, {payload}: any): SubjectsStateModel {

    return setState(state => ({...state, currentPage: payload}));

  }
  @Action(Subjects.ChangePagination)
  public changePagination({setState}: StateContext<SubjectsStateModel>, {payload}: any): SubjectsStateModel {

      return setState(state => ({...state, paginationConstant: payload}));

  }

  @Action(Subjects.AddDate)
  public addNewDate({dispatch}: StateContext<SubjectsStateModel>, {payload}: any): Observable<void> {

    return dispatch(new Subjects.Update(payload));

  }
  @Action(Subjects.ChangeTeacher)
  public changeTeacher({dispatch}: StateContext<SubjectsStateModel>, {payload}: any): Observable<void> {

    return dispatch(new Subjects.Update(payload));

  }
  @Action(Subjects.DeleteDate)
  public deleteDate({dispatch}: StateContext<SubjectsStateModel>, {subject}: any): void {

    const [marks, sub] = subject;
    dispatch(new Subjects.Update(sub));

    marks.forEach(mark => dispatch(new Marks.Delete(mark)));

  }
  @Action(Subjects.Patch)
  public patchSubject({setState, getState, dispatch}: StateContext<SubjectsStateModel>, {payload}: any): Observable<Observable<void> | ISubject> {

    setState({
      ...getState(),
      loading: true,
      loaded: false,
    });

    const patchTapCb: (patchedSubject: ISubject) => void = (patchedSubject: ISubject): SubjectsStateModel => setState(
      <SubjectsStateModel | StateOperator<SubjectsStateModel>>patch(
        {
          loading: false, loaded: true,
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
  public patchSubjectError({patchState}: StateContext<StudentsStateModel>, {payload}: any): void {

    patchState({error: payload, loading: false, loaded: false});

  }

  @Action(Subjects.SetSortedColumn)
  public setSortedColumn({getState, setState, dispatch}: StateContext<SubjectsStateModel>, {payload}: any): void {

    const state: SubjectsStateModel = getState();

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
  public keepSubjectUpdated({setState}: StateContext<SubjectsStateModel>, {payload}: any): void {

    this.subjectsService.updateSubjectState(payload);

    setState(patch({
      data: updateItem(subj => subj.id === payload.id, payload)
    }));


  }

  @Action(Subjects.Submit)
  public submitChanges({dispatch, setState, getState}: StateContext<SubjectsStateModel>): void {

    if (this.subjectsService.subjectToUpdate) {

      dispatch(new Subjects.Patch(this.subjectsService.subjectToUpdate));

      this.subjectsService.updateSubjectState(undefined);

    }

    dispatch(new Marks.Submit());
    const state: SubjectsStateModel = getState();
    setState({
      ...state,
      popups: {table: {type: "success", value: ``, action: "change"}, list: state.popups.list},
    });
  }

  @Action(Subjects.PopUpCancelList)
  public cancelListPopUp({setState, getState}: StateContext<SubjectsStateModel>): SubjectsStateModel {

    return setState(state => ({...state, popups: {list: null, table: getState().popups.table}}));

  }

  @Action(Subjects.PopUpCancelTable)
  public cancelTablePopUp({setState, getState}: StateContext<SubjectsStateModel>): SubjectsStateModel {
    return setState(state => ({...state, popups: {list: getState().popups.list, table: null}}));

  }

}
