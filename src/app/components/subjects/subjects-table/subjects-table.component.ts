import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {SubjectsService} from "../../../common/services/subjects.service";
import {Observable} from "rxjs";
import {ISubject} from "../../../common/models/ISubject";
import {withLatestFrom, map} from "rxjs/internal/operators";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: "app-subjects-table",
  templateUrl: "./subjects-table.component.html",
  styleUrls: ["./subjects-table.component.sass"]
})
export class SubjectsTableComponent implements OnInit, OnDestroy {
  public subject$: Observable<ISubject>;
  public subject: ISubject;
  public form: FormGroup = new FormGroup({
    teacher: new FormControl("")
  });
  constructor(
    private subjectsService: SubjectsService,
    private route: ActivatedRoute
  ) { }

  public ngOnInit(): void {
    this.subject$ = this.subjectsService.subjects.pipe(
      withLatestFrom(this.route.params),
      map(data => data[0].filter(subj => subj._id === +data[1].id))
    );

    this.subject$.subscribe(data => this.subject = data);
  }
  public ngOnDestroy(): void {
  }

  public submitTeacher(): void {
    this.subject[0].teacher = this.form.get("teacher").value;
    this.form.reset();
  }
}
