import {Component, OnDestroy, OnInit} from "@angular/core";
import {ISubject} from "../../../common/models/ISubject";
import {SubscriptionManager} from "../../../common/helpers/SubscriptionManager";
import {Observable} from "rxjs";
import {AppState} from "../../../@ngrx/app.state";
import {SubjectsState} from "../../../@ngrx/subjects/subjects.state";
import {select, Store} from "@ngrx/store";
import * as SubjectsActions from "src/app/@ngrx/subjects/subjects.actions";
@Component({
  selector: "app-subjects-list",
  templateUrl: "./subjects-list.component.html",
  styleUrls: ["./subjects-list.component.sass"]
})
export class SubjectsListComponent implements OnInit, OnDestroy {

  public manager: SubscriptionManager;
  public subjects: ISubject[];
  public subjectsState$: Observable<SubjectsState>;
  constructor(
    private store: Store<AppState>,
  ) {
    this.manager = new SubscriptionManager();
  }
  public deleteSubject($event: Event): void {
    const subjName: string = $event.target.parentNode.getAttribute("subject");
    const subjId: string = this.subjects.filter(subj => subj.name === subjName)[0].id;
    this.store.dispatch(SubjectsActions.deleteSubject({subject: subjId}));
  }
  public ngOnInit(): void {
    this.subjectsState$ = this.store.pipe(select("subjects"));
    this.manager.addSubscription(this.subjectsState$.subscribe(state => {
      this.subjects = state.data;
    }));
    if (!this.subjects.length) {
      this.store.dispatch(SubjectsActions.getSubjects());
    }
  }
  public ngOnDestroy(): void {
    this.manager.removeAllSubscription();
  }
}
