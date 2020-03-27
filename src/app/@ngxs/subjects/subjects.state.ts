import {State, Action, StateContext, Selector, Store} from "@ngxs/store";
import {catchError, retry, tap} from "rxjs/internal/operators";
import {Injectable} from "@angular/core";
import {of} from "rxjs";
import {ISubject} from "../../common/models/ISubject";
import {SubjectsService} from "../../common/services/subjects.service";
import {Subjects} from "./subjects.actions";
import {IStudent} from "../../common/models/IStudent";
import {NgxsStudentsState, StudentsStateModel} from "../students/students.state";
import {Students} from "../students/students.actions";
import {Mark} from "../../common/models/IMark";
import {state} from "@angular/animations";
import {append, patch, removeItem, updateItem} from "@ngxs/store/operators";
import {Marks} from "../marks/marks.actions";

export class SubjectsStateModel {
  public data: ISubject[];
  public loading: boolean;
  public loaded: boolean;
  public paginationConstant: number;
  public currentPage: number;
}

export class SubjectTableState implements SubjectsStateModel{
  public students: IStudent[];
  public marks: Mark[];
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
  public createSubject({setState, dispatch}: StateContext<SubjectsStateModel>, {payload}: ISubject): void {
    return this.subjectsService.addSubject(payload).pipe(
      tap(apiResponse => {
        return setState(
          patch({
            data: append([apiResponse])
          })
        );
      }),
      retry(3),
      catchError(error => of(dispatch(new Subjects.CreateError(error))))
    );
  }
  @Action(Subjects.CreateError)
  public createSubjectError({getState, setState}: StateContext<SubjectsStateModel>, {payload}: (string | Error)): void {
    console.log(payload, "ERROR CREATE");  }

  @Action(Subjects.Delete)
  public deleteSubject({getState, setState, dispatch}: StateContext<SubjectsStateModel>, {payload}: string): void {
    const deletedSubject: ISubject = getState().data.filter(subj => subj.name === payload)[0];
    return this.subjectsService.deleteSubject(deletedSubject.id).pipe(
      tap(deleteResponse => {
          setState(patch({
            data: removeItem(subj => subj.name === payload)
          }));
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

  @Action(Subjects.AddDate)
  public addNewDate({dispatch}: StateContext<SubjectsStateModel>, {payload}: ISubject): void {
    return dispatch(new Subjects.Patch(payload));
  }
  @Action(Subjects.ChangeTeacher)
  public changeTeacher({dispatch}: StateContext<SubjectsStateModel>, {payload}: ISubject): void {
    return dispatch(new Subjects.Patch(payload));
  }
  @Action(Subjects.DeleteDate)
  public deleteDate({dispatch}: StateContext<SubjectsStateModel>, {subject, marks}: ISubject): void {
    marks.forEach(mark => dispatch(new Marks.Delete(mark.id)));
    return dispatch(new Subjects.Patch(subject));
  }
  @Action(Subjects.Patch)
  public patchSubject({setState, dispatch}: StateContext<SubjectsStateModel>, {payload}: ISubject): void {
    const patchTapCb: Function = patchedSubject => setState(
      patch(
        {
          data: updateItem(subj => subj.id === patchedSubject.id, patchedSubject)
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
  public patchSubjectError({getState, setState}: StateContext<StudentsStateModel>, {payload}: (string | Error)): void {
    console.log(payload, "ERROR PATCH SUBJECT");
  }

}

