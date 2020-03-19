import {Component, OnInit} from "@angular/core";
import {Store} from "@ngrx/store";
import {AppState} from "../../../@ngrx/app.state";
import {SubjectsState} from "../../../@ngrx/subjects/subjects.state";
import {select, Store} from "@ngrx/store";
import * as SubjectsActions from "src/app/@ngrx/subjects/subjects.actions";
import {StudentsState} from "../../../@ngrx/students/students.state";
import * as StudentsActions from "src/app/@ngrx/students/students.actions.ts";
import * as MarksActions from "src/app/@ngrx/marks/marks.actions";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.sass"]
})
export class AppComponent implements OnInit{
  public title = "teacher-journal";
  constructor(
    private store: Store<AppState>
  ){}
  public ngOnInit(): void {
    this.store.dispatch(StudentsActions.getStudents());
    this.store.dispatch(SubjectsActions.getSubjects());
    this.store.dispatch(MarksActions.getMarks());
  }
}
