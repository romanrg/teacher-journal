import {Component, OnDestroy, OnInit} from "@angular/core";
import {Store} from "@ngrx/store";
import {AppState} from "../../../@ngrx/app.state";
import {SubjectsState} from "../../../@ngrx/subjects/subjects.state";
import {select, Store} from "@ngrx/store";
import * as SubjectsActions from "src/app/@ngrx/subjects/subjects.actions";
import {StudentsState} from "../../../@ngrx/students/students.state";
import * as StudentsActions from "src/app/@ngrx/students/students.actions.ts";
import * as MarksActions from "src/app/@ngrx/marks/marks.actions";
import {Observable} from "rxjs";

// ngxs
import * as Ngxs from "@ngxs/store"
import {Select} from "@ngxs/store";
import {NgxsStudentsState, StudentsStateModel} from "../@ngxs/students/students.state";
import {Students} from "../@ngxs/students/students.actions";
import {NgxsSubjectsState, SubjectsStateModel} from "../@ngxs/subjects/subjects.state";
import {Subjects} from "../@ngxs/subjects/subjects.actions";
import {AutoUnsubscribe, SubscriptionManager} from "../common/helpers/SubscriptionManager";
import {Marks} from "../@ngxs/marks/marks.actions";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.sass"]
})
export class AppComponent implements OnInit, OnDestroy {
  private manager: SubscriptionManager;
  @Select(NgxsStudentsState.Students) public students$: Observable<StudentsStateModel>;
  @Select(NgxsSubjectsState.Subjects) public subjects$: Observable<SubjectsStateModel>;
  public componentState$: Observable<AppState>;
  constructor(
    private store: Store<AppState>,
    private ngxsStore: Ngxs.Store,
  ){
    this.manager = new SubscriptionManager();
  }
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
      /*
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
    this.manager.addSubscription(this.componentState$ = this.store.pipe(
      select(mapFnForSelecting, ["subjects", "students", "marks"])
    ));
    */
    this.ngxsStore.dispatch(new Students.Get());
    this.ngxsStore.dispatch(new Subjects.Get());
    this.ngxsStore.dispatch(new Marks.Get());
  }
  public ngOnDestroy(): void {
    this.manager.removeAllSubscription();
  }

  public dispatchLanguage($event: Event): void {
    this.store.dispatch(StudentsActions.changeLanguage({language: $event.target.value}));
  }
}
