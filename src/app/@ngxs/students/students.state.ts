import { State, Action, StateContext, Selector} from "@ngxs/store";
import {IStudent} from "../../common/models/IStudent";
import {Students} from "./students.actions";
import {StudentsServiceService} from "../../common/services/students.service";
import {catchError, retry, tap} from "rxjs/internal/operators";
import {Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import {Statistics} from "../statistics/statistics.actions";

export class StudentsStateModel {
  public data: IStudent[];
  public searchBarInputValue: (string|null);
  public searchedStudents: IStudent[];
  public loading: boolean;
  public loaded: boolean;
  public paginationConstant: number;
  public currentPage: number;
  public error: (string| Error)|null;
}

@State<StudentsStateModel>({
  name: "students",
  defaults: {
    data: [],
    searchBarInputValue: null,
    searchedStudents: null,
    loading: true,
    loaded: false,
    paginationConstant: 5,
    currentPage: 1,
    error: null,
  }
})
@Injectable({
  providedIn: "root"
})
export class NgxsStudentsState {

  constructor(
    private studentsService: StudentsServiceService
  ) {}

  @Selector()
  public static Students(state: StudentsStateModel): StudentsStateModel {
    return state;
  }
  @Action(Students.Get)
  public getStudents({getState, setState, dispatch}: StateContext<StudentsStateModel>): Observable<IStudent[]> {
    setState({
      ...getState(),
      loading: true,
      loaded: false,
    });
    return this.studentsService.fetchStudents().pipe(
      tap(studentsResponse => {
        studentsResponse.forEach(student => student.id = student._id);
        dispatch(new Statistics.SetStudents(studentsResponse));
        return setState({...getState(), data: [...studentsResponse], loading: false, loaded: true})
      }),
      retry(3),
      catchError(error => of(dispatch(new Students.GetError(error))))
    );
  }
  @Action(Students.GetError)
  public studentsGetError({patchState}: StateContext<StudentsStateModel>, {payload}: (string|Error)): void {
    patchState({error: payload, loading: false, loaded: false});
  }

  @Action(Students.Create)
  public createStudent({getState, setState, patchState, dispatch}: StateContext<StudentsStateModel>, {payload}: IStudent): Observable<IStudent> {
    setState({
      ...getState(),
      loading: true,
      loaded: false,
    });
    const state: StudentsStateModel = getState();
    return this.studentsService.addStudent(payload).pipe(
      tap(apiResponse => {
        apiResponse.id = apiResponse._id;
        patchState({
          data: [...state.data].concat(apiResponse),
          loading: false,
          loaded: true
        });
      }),
      retry(3),
      catchError(error => of(dispatch(new Students.CreatetError(error))))
    );
  }
  @Action(Students.CreatetError)
  public createStudentError({patchState}: StateContext<StudentsStateModel>, {payload}: (string | Error)): void {
    patchState({error: payload, loading: false, loaded: false});
  }

  @Action(Students.Delete)
  public deleteStudent({getState, setState, dispatch}: StateContext<StudentsStateModel>, {payload}: string): object {
    setState({
      ...getState(),
      loading: true,
      loaded: false,
    });
    return this.studentsService.removeStudent(payload.id).pipe(
      tap(deleteResponse => {
          setState({
            ...getState(),
            data: getState().data.filter(student => student.id !== payload.id),
            loading: false,
            loaded: true
          });
        }
      ),
      retry(3),
      catchError(error => of(dispatch(new Students.DeleteError(error))))
    );
  }
  @Action(Students.DeleteError)
  public deleteError({patchState}: StateContext<StudentsStateModel>, {payload}: (string | Error)): void {
    patchState({error: payload, loading: false, loaded: false});
  }

  @Action(Students.Search)
  public searchStudent({getState, setState, dispatch}: StateContext<StudentsStateModel>, {payload}: string): Observable<IStudent[]> {
    const filterFn = (student: IStudent) =>
      student.name.toLowerCase().includes(payload.toLowerCase()) ||
      student.surname.toLowerCase().includes(payload.toLowerCase()) ||
      student.address.toLowerCase().includes(payload.toLowerCase()) ||
      student.description.toLowerCase().includes(payload.toLowerCase());
    const filtered: IStudent[] = getState().data.filter(filterFn);
    setState({
      ...getState(),
      searchedStudents: [...filtered],
      searchBarInputValue: payload,
      currentPage: 1,
    });
  }

  @Action(Students.SearchError)
  public searchStudentError({patchState}: StateContext<StudentsStateModel>, {payload}: (string | Error)): void {
    patchState({error: payload});
  }

  @Action(Students.ChangeCurrentPage)
  public changeCurrent({setState}: StateContext<StudentsStateModel>, {payload}: number): void {
    setState(state => ({...state, currentPage: payload}));
  }
  @Action(Students.ChangePagination)
  public changePagination({setState}: StateContext<StudentsStateModel>, {payload}: number): void {
    setState(state => ({...state, paginationConstant: payload}));
  }
}

