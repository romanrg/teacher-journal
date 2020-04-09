import {Component, OnInit} from "@angular/core";
import {AppState} from "../../../@ngrx/app.state";
import {SubjectsState} from "../../../@ngrx/subjects/subjects.state";
import {StudentsState} from "../../../@ngrx/students/students.state";

// ngxs
import * as Ngxs from "@ngxs/store";
import {Students} from "../@ngxs/students/students.actions";
import {Subjects} from "../@ngxs/subjects/subjects.actions";
import {AutoUnsubscribe} from "../common/helpers/SubscriptionManager";
import {Marks} from "../@ngxs/marks/marks.actions";
import {Observable} from "rxjs";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.sass"]
})
export class AppComponent implements OnInit {
  public langOptions: [string, string] = ["ru", "en"];
  public isLoad$: Observable<boolean> = store
    .select(state => Object.keys(state)
      .map(key => state[key].loading)
      .every(load => load)
    );
  public errors$: Observable<(Error|string)[]> = store
    .select(state => Object.keys(state)
      .map(key => state[key].error)
    );
  constructor(
    private store: Ngxs.Store,
    private translateService: TranslateService
  ) {
    this.store.dispatch([new Students.Get()/*, new Subjects.Get(), new Marks.Get()*/]);
    this.translateService.setDefaultLang(navigator.language);
    this.translateService.use(navigator.language);
  }
  public isAnyErrorOccur = (errors: (string|Error)[]): boolean => errors.some(err => err);
  public getDefaultLang = () => navigator.language;
  public dispatchLanguage = ($event: Event): void => this.translateService.use($event.target.value);
}
