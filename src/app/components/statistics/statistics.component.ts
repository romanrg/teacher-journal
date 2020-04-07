import {Component, forwardRef, OnInit} from "@angular/core";

// ngxs
import * as Ngxs from "@ngxs/store";
import {SubjectTableState} from "../../../@ngxs/subjects/subjects.state";
import {Subjects} from "../../../@ngxs/subjects/subjects.actions";
import {Marks} from "../../../@ngxs/marks/marks.actions";
import {forkJoin, Observable, of} from "rxjs";
import {ISubject} from "../../common/models/ISubject";
import {__filter, _chain, _compose, _partial, _pluck, _take} from "../../common/helpers/lib";
import {IStudent} from "../../common/models/IStudent";
import {Mark} from "../../common/models/IMark";
import {ControlValueAccessor, FormArray, FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR} from "@angular/forms";
import {mergeMap, tap} from "rxjs/internal/operators";
@Component({
  selector: "app-statistics",
  templateUrl: "./statistics.component.html",
  styleUrls: ["./statistics.component.sass"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StatisticsComponent),
      multi: true
    }
  ]
})
export class StatisticsComponent implements OnInit, ControlValueAccessor {
  public state$: Observable<SubjectTableState>;
  public subjects: Observable<ISubject[]>;
  public students: Observable<IStudent[]>;
  public marks: Observable<Mark[]>;

  // form
  public dropdown: FormGroup;
  public changesArray: [];

  constructor(
    private store: Ngxs.Store,
    private formBuilder: FormBuilder
  ) {
    this.state$ = this.store.select(state => _chain(
      () => _compose(_partial(_pluck, "data"), _partial(_pluck, "subjects"))(state),
      () => _compose(_partial(_pluck, "data"), _partial(_pluck, "students"))(state),
      () => _compose(_partial(_pluck, "data"), _partial(_pluck, "marks"))(state)
    ));
  }

  public writeValue(value: any): void {}

  public registerOnTouched(fn: any): void {}

  public registerOnChange(fn: any): void {}

  public ngOnInit(): void {


    this.state$.pipe(
      tap(([subjects, students, marks]) => {

        this.subjects = __filter(({uniqueDates}) => uniqueDates.length > 0)(subjects);

        this.marks =  this.subjects.reduce((acc, {id}) => {
          acc[id] = __filter(({subject}) => id === subject)(marks);
          return acc;
        }, {});

        this.dropdown = new FormGroup(this.generateSubjectsFormControls(this.subjects));
      }),
    ).subscribe();


  }

  public getSubjectControl = (i: number): FormGroup => this.dropdown.controls.subjs.controls[i];

  public generateSubjectsFormControls = (subjects: ISubject[]): FormArray  => {
    return _take(subjects, "name").reduce((acc, current) => {
      acc[current] = new FormControl(false);
      return acc;
    }, {})
  };

  public getOnlyUniqueDates = (marks: Mark[]) => Array.from(new Set(marks.map(mark => _pluck("time", mark))));

  public expandItem(target: EventTarget): void {

  }

  public checkAll(): void {
    const ctrls: FormGroup = this.dropdown.controls;
    Object.keys(ctrls).map((controlName: string) => ctrls[controlName].setValue(true));
  }

  public unCheckAll(): void {
    const ctrls: FormGroup = this.dropdown.controls;
    Object.keys(ctrls).map((controlName: string) => ctrls[controlName].setValue(false));
  }
}
