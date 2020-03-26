import { State, Action, StateContext, Selector} from "@ngxs/store";
import {IStudent} from "../../common/models/IStudent";
import {GetStudents, DeleteStudent, Students} from "./students.actions";
import {StudentsServiceService} from "../../common/services/students-service.service";
import {catchError, retry, tap} from "rxjs/internal/operators";
import {Injectable} from "@angular/core";
import {of} from "rxjs";

export class StudentsStateModel {
  public data: IStudent[];
  public searchBarInputValue: (string|null);
  public searchedStudents: IStudent[];
  public loading: boolean;
  public loaded: boolean;
  public paginationConstant: number;
  public currentPage: number;
}

@State<StudentsStateModel>({
  name: "students",
  defaults: {
    data: [],
    searchBarInputValue: null,
    searchedStudents: null,
    loading: false,
    loaded: false,
    paginationConstant: 5,
    currentPage: 1
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
  public static Students(state: StudentsStateModel): IStudent[] {
    return state;
  }
  @Action(Students.Get)
  public getStudents({getState, setState, dispatch}: StateContext<StudentsStateModel>): void {
    return this.studentsService.fetchStudents().pipe(
      tap(studentsResponse => setState({...getState(),   data: [...studentsResponse], loaded: true})),
      retry(3),
      catchError(error => of(dispatch(new Students.GetError(error))))
    );
  }
  @Action(Students.GetError)
  public studentsGetError({getState, setState}: StateContext<StudentsStateModel>, {payload}: (string|Error)): void {
      console.log(payload, "ERROR GET");
  }

  @Action(Students.Create)
  public createStudent({getState, patchState, dispatch}: StateContext<StudentsStateModel>, {payload}: IStudent): void {
    const state: StudentsStateModel = getState();
    return this.studentsService.addStudent(payload).pipe(
      tap(apiResponse => {
        patchState({
          data: [...state.data].concat(apiResponse)
        });
      }),
      retry(3),
      catchError(error => of(dispatch(new Students.CreatetError(error))))
    );
  }
  @Action(Students.CreatetError)
  public createStudentError({getState, setState}: StateContext<StudentsStateModel>, {payload}: (string | Error)): void {
    console.log(payload, "ERROR CREATE");
  }

  @Action(Students.Delete)
  public deleteStudent({getState, setState, dispatch}: StateContext<StudentsStateModel>, {payload}: string): void {
    return this.studentsService.removeStudent(payload.id).pipe(
      tap(deleteResponse => setState({...getState(), data: getState().data.filter(student => student.id !== payload.id)})),
      retry(3),
      catchError(error => of(dispatch(new Students.DeleteError(error))))
    );
  }
  @Action(Students.DeleteError)
  public deleteError({getState, setState}: StateContext<StudentsStateModel>, {payload}: (string | Error)): void {
    console.log(payload, "ERROR DELETE");
  }

  @Action(Students.Search)
  public searchStudent({getState, setState, dispatch}: StateContext<StudentsStateModel>, {payload}: string): void {
    console.log(payload)
    return this.studentsService.searchStudent(payload).pipe(
      tap(apiResponse =>  setState({...getState(), searchedStudents: [...apiResponse], searchBarInputValue: payload, currentPage: 1})),
      retry(3),
      catchError(error => of(dispatch(new Students.SearchError(error))))
    );
  }

  @Action(Students.SearchError)
  public searchStudentError({getState, setState}: StateContext<StudentsStateModel>, {payload}: (string | Error)): void {
    console.log(payload, "ERROR WHILE SEARCH STUDENT");
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

