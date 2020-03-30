import {Component, OnDestroy, OnInit} from "@angular/core";
import {AppState} from "../../../@ngrx/app.state";
import {SubjectsState} from "../../../@ngrx/subjects/subjects.state";
import {StudentsState} from "../../../@ngrx/students/students.state";
import * as StudentsActions from "src/app/@ngrx/students/students.actions.ts";

// ngxs
import * as Ngxs from "@ngxs/store"
import {Select} from "@ngxs/store";
import {NgxsStudentsState, StudentsStateModel} from "../@ngxs/students/students.state";
import {Students} from "../@ngxs/students/students.actions";
import {NgxsSubjectsState, SubjectsStateModel} from "../@ngxs/subjects/subjects.state";
import {Subjects} from "../@ngxs/subjects/subjects.actions";
import {AutoUnsubscribe, SubscriptionManager} from "../common/helpers/SubscriptionManager";
import {Marks} from "../@ngxs/marks/marks.actions";
import {Observable} from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.sass"]
})
export class AppComponent implements OnInit, OnDestroy {
  public isLoad$: Observable<boolean>;
  public errors$: Observable<(Error|string)[]>;
  constructor(
    private ngxsStore: Ngxs.Store,
  ){
    this.isLoad$ = ngxsStore.select(state => Object.keys(state).map(key => state[key].loading).every(load => load));
    this.errors$ = ngxsStore.select(state => Object.keys(state).map(key => state[key].error));
  }
  public ngOnInit(): void {
    this.ngxsStore.dispatch(new Students.Get());
    this.ngxsStore.dispatch(new Subjects.Get());
    this.ngxsStore.dispatch(new Marks.Get());
  }
  public ngOnDestroy(): void {
  }
  public isAnyErrorOccur(errors: (string|Error)[]): boolean {
    return errors.some(err => err);
  }

  public dispatchLanguage($event: Event): void {
    this.store.dispatch(StudentsActions.changeLanguage({language: $event.target.value}));
  }
}
