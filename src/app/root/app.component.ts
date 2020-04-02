import {Component, OnInit} from "@angular/core";
import {AppState} from "../../../@ngrx/app.state";
import {SubjectsState} from "../../../@ngrx/subjects/subjects.state";
import {StudentsState} from "../../../@ngrx/students/students.state";
import * as StudentsActions from "src/app/@ngrx/students/students.actions.ts";

// ngxs
import * as Ngxs from "@ngxs/store";
import {Students} from "../@ngxs/students/students.actions";
import {Subjects} from "../@ngxs/subjects/subjects.actions";
import {AutoUnsubscribe} from "../common/helpers/SubscriptionManager";
import {Marks} from "../@ngxs/marks/marks.actions";
import {Observable} from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import {environment} from "../../environments/environment";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.sass"]
})
export class AppComponent implements OnInit {
  public isLoad$: Observable<boolean> = store.select(state => Object.keys(state).map(key => state[key].loading).every(load => load));;
  public errors$: Observable<(Error|string)[]> = store.select(state => Object.keys(state).map(key => state[key].error));
  constructor(
    private store: Ngxs.Store,
    private translateService: TranslateService
  ) {
    this.store.dispatch([new Students.Get(), new Subjects.Get(), new Marks.Get()]);
  }
  public isAnyErrorOccur = (errors: (string|Error)[]): boolean => errors.some(err => err);

  public dispatchLanguage = ($event: Event): void => this.store.dispatch(StudentsActions.changeLanguage({language: $event.target.value}));

  public ngOnInit = (): void =>  this.translateService.use(environment.defaultLocale);
}
