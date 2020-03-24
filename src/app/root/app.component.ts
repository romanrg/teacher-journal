import {Component, OnInit} from "@angular/core";
import {Store} from "@ngrx/store";
import {AppState} from "../../../@ngrx/app.state";
import {SubjectsState} from "../../../@ngrx/subjects/subjects.state";
import {select, Store} from "@ngrx/store";
import * as SubjectsActions from "src/app/@ngrx/subjects/subjects.actions";
import {StudentsState} from "../../../@ngrx/students/students.state";
import * as StudentsActions from "src/app/@ngrx/students/students.actions.ts";
import * as MarksActions from "src/app/@ngrx/marks/marks.actions";
import {Observable} from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.sass"]
})
export class AppComponent implements OnInit {
  public componentState$: Observable<AppState>;
  constructor(
    private store: Store<AppState>
  ){}
  public isLoading( st: AppState): boolean {
    return Object.keys(st).every(key => st[key].loading === false);
  }
  public isAnyErrorsOccur(st: AppState): boolean {
    return Object.keys(st).some(key => st[key].error);
  }
  public getAllStateErrors(st: AppState): ErrorEvent[] {
    return Object.keys(st).map(key => st[key].error).filter(err => err);
  }
  public ngOnInit(): void {
    this.store.dispatch(StudentsActions.getStudents());
    this.store.dispatch(SubjectsActions.getSubjects());
    this.store.dispatch(MarksActions.getMarks());

    const mapFnForSelecting: Function = (state, props): {
      subjects: SubjectsState,
      students: StudentsState,
      marks: MarksState
    } => {
      const componentsState: {
        subjects: SubjectsState,
        students: StudentsState,
        marks: MarksState
      } = {};
      props.forEach(prop => componentsState[prop] = state[prop]);
      return componentsState;
    };
    this.componentState$ = this.store.pipe(
      select(mapFnForSelecting, ["subjects", "students", "marks"])
    );
  }
}
