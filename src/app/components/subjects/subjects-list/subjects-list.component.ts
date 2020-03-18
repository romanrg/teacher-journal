import {Component, OnDestroy, OnInit} from "@angular/core";
import {SubjectsService} from "../../../common/services/subjects.service";
import {ISubject} from "../../../common/models/ISubject";
import {SubscriptionManager} from "../../../common/helpers/SubscriptionManager";
import {AppState} from "../../../@ngrx/app.state";
import {Observable} from "rxjs";
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
    public subjectService: SubjectsService,
    private store: Store<AppState>,
  ) {
    this.manager = new SubscriptionManager();
  }
  public deleteSubject($event: Event): void {
    const subjName: string = $event.target.parentNode.getAttribute("subject");
    this.manager.addSubscription(this.subjectService.deleteSubject(subjName).subscribe(
      data => {
        this.manager.addSubscription(this.subjectService.fetchSubjects()
          .subscribe(subs => {
            this.subjectService.subjects = subs;
            this.subjects = this.subjectService.subjects;
          }));
      }
    ));
  }
  public ngOnInit(): void {
    this.store.dispatch(SubjectsActions.getSubjects());
    this.subjectsState$ = this.store.pipe(select("subjects"));
    this.manager.addSubscription(this.subjectsState$.subscribe(state => {
      this.subjects = state.data;
    }));
  }
  public ngOnDestroy(): void {
    this.manager.removeAllSubscription();
  }
}
