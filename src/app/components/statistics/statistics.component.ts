import {Component, forwardRef, OnInit} from "@angular/core";

// ngxs
import * as Ngxs from "@ngxs/store";
import {SubjectTableState} from "../../../@ngxs/subjects/subjects.state";
import {Subjects} from "../../../@ngxs/subjects/subjects.actions";
import {Marks} from "../../../@ngxs/marks/marks.actions";
import {forkJoin, Observable, of} from "rxjs";
import {ISubject} from "../../common/models/ISubject";
import {__filter, _chain, _compose, _partial, _pluck} from "../../common/helpers/lib";
import {IStudent} from "../../common/models/IStudent";
import {Mark} from "../../common/models/IMark";
import {ControlValueAccessor} from "@angular/forms";
import {tap} from "rxjs/internal/operators";
@Component({
  selector: "app-statistics",
  templateUrl: "./statistics.component.html",
  styleUrls: ["./statistics.component.sass"],
})
export class StatisticsComponent implements OnInit, ControlValueAccessor {
  public state$: Observable<SubjectTableState>;
  // [subj, checked, expaneded]
  public subjects: [ISubject, boolean, boolean][];
  public students: Observable<IStudent[]>;
  public marks: Observable<Mark[]>;
  public dates: [number, boolean, boolean][];

  // form
  public selected: [number, number] = [null, null];

  constructor(
    private store: Ngxs.Store,
  ) {
    this.state$ = this.store.select(state => _chain(
      () => _compose(_partial(_pluck, "data"), _partial(_pluck, "subjects"))(state),
      () => _compose(_partial(_pluck, "data"), _partial(_pluck, "students"))(state),
      () => _compose(_partial(_pluck, "data"), _partial(_pluck, "marks"))(state)
    ));
  }

  public ngOnInit(): void {


    this.state$.pipe(
      tap(([subjects, students, marks]) => {

        this.subjects = __filter(({uniqueDates}) => uniqueDates.length > 0)(subjects).reduce((acc, subject) => {
          acc = [...acc, [subject, false, false]];
          return acc;
        }, []);

        this.marks =  this.subjects.reduce((acc, tuple) => {
          acc[tuple[0].id] = __filter(({subject}) => tuple[0].id === subject)(marks);
          return acc;
        }, {});

        this.dates = this.subjects.reduce((acc, subject) => {
          const id = subject[0].id;
          acc = [...acc, this.getOnlyUniqueDates(this.marks[id])];
          return acc;
        }, []);

        console.log(this.dates)

      })
    ).subscribe();


  }

  public getOnlyUniqueDates = (marks: Mark[]) => Array.from(new Set(marks.map(mark => _pluck("time", mark)))).reduce((acc, subject) => {
    acc = [...acc, [subject, false, false]];
    return acc;
  }, []);


  public checkAll(): void {
    this.subjects.map((tuple) => {
      tuple[1] = true;
    });
  }

  public unCheckAll(): void {
    this.subjects.map(tuple => tuple[1] = false);
  }

  public expandAll(): void {
    this.subjects.map(tuple => tuple[2] = true);
  }

  public collapseAll(): void {
    this.subjects.map(tuple => tuple[2] = false);
  }

  public changeCheck(tuple: [ISubject, boolean, boolean]): void {
    tuple[2] = tuple[1];
  }

  public addDate(date: [number, boolean, boolean]): void {

    console.log(date);


    if (date < this.selected[0] || this.selected[0] === null) {
      this.selected[0] = date[0];
    }

    if (date > this.selected[0] || this.selected[1] === null) {
      this.selected[1] = date[0];
    } else if (this.date > this.selected[1]) {
      his.selected[1] = date[0];
    }

    date[1] = true;

    console.log(date);

  }
}
