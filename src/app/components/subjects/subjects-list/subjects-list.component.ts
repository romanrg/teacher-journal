import {Component, OnDestroy, OnInit} from "@angular/core";
import {SubjectsService} from "../../../common/services/subjects.service";
import {ISubject} from "../../../common/models/ISubject";
import {SubscriptionManager} from "../../../common/helpers/SubscriptionManager";

@Component({
  selector: "app-subjects-list",
  templateUrl: "./subjects-list.component.html",
  styleUrls: ["./subjects-list.component.sass"]
})
export class SubjectsListComponent implements OnInit, OnDestroy {

  public manager: SubscriptionManager;
  public subjects: ISubject[];
  constructor(
    public subjectService: SubjectsService,
  ) {
    this.manager = new SubscriptionManager();
  }

  public ngOnInit(): void {
    if (this.subjectService.subjects.length) {
      this.subjects = this.subjectService.subjects;
    } else {
      this.manager.addSubscription(this.subjectService.fetchSubjects().subscribe(data => {
        this.subjects = data;
        this.subjectService.subjects = this.subjects;
      }));
    }
  }

  public addNewSubject(): void {
  }

  public ngOnDestroy(): void {
    this.manager.removeAllSubscription();
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
}
