import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {SubjectsService} from "../../../common/services/subjects.service";
import {Observable} from "rxjs";
import {ISubject} from "../../../common/models/ISubject";
import {withLatestFrom, map, filter, find, tap} from "rxjs/internal/operators";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: "app-subjects-table",
  templateUrl: "./subjects-table.component.html",
  styleUrls: ["./subjects-table.component.sass"]
})
export class SubjectsTableComponent implements OnInit, OnDestroy {
  public subject: ISubject;
  public form: FormGroup = new FormGroup({
    teacher: new FormControl("")
  });
  constructor(
    private subjectsService: SubjectsService,
    private route: ActivatedRoute
  ) { }

  public ngOnInit(): void {

  }
  public ngOnDestroy(): void {
  }

  public submitTeacher(): void {
    this.subject[0].teacher = this.form.get("teacher").value;
    this.form.reset();
  }
}
