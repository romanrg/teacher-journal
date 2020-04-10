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
import {ControlValueAccessor} from "@angular/forms";
import {tap} from "rxjs/internal/operators";
@Component({
  selector: "app-statistics",
  templateUrl: "./statistics.component.html",
  styleUrls: ["./statistics.component.sass"],
})
export class StatisticsComponent implements OnInit, ControlValueAccessor {

  public state$: Observable<SubjectTableState>;
  public render: Map = new Map();

  // [subj, checked, expaneded]
  public subjects: [ISubject, boolean, boolean][];
  public students: Observable<IStudent[]>;
  public marks: Observable<Mark[]>;
  public dates: [number, boolean, boolean][];

  // form
  public selected: [number, number] = [];
  public isHidden: boolean = true;

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
        },                                                                                   []);

        this.marks =  this.subjects.reduce((acc, tuple) => {
          acc[tuple[0].id] = __filter(({subject}) => tuple[0].id === subject)(marks);
          return acc;
        },                                 {});

        this.dates = this.subjects.reduce((acc, subject) => {
          const id: string = subject[0].id;
          acc[id] = this.getOnlyUniqueDates(this.marks[id]);
          return acc;
        },                                {});

        this.students = students.reduce((acc, student) => {
          acc[student.id] = student;
          return acc;
        }, {});

      })
    ).subscribe();

  }

  public getOnlyUniqueDates = (marks: Mark[]) => Array.from(new Set(marks.map(mark => _pluck("time", mark)))).reduce((acc, subject) => {
    acc = [...acc, [subject, false, false]];
    return acc;
  },                                                                                                                 [])

  public checkAll = (): void => {
    this.subjects.map((tuple) => tuple[1] = true);
    Object.values(this.dates).forEach(dates => dates.map(tuple => {
      tuple[1] = true;
      this.selected = this.selectDate(this.selected, tuple[0]);
    }));
    this.selected.sort((a, b) => a - b);
  };

  public unCheckAll = (): void => {
    this.subjects.map(tuple => tuple[1] = false);
    Object.values(this.dates).forEach(dates => dates.map(tuple => tuple[1] = false));
    this.selected.length = 0;
  }

  public expandAll = (): void => {
    this.subjects.map(tuple => tuple[2] = true);
  }

  public collapseAll = (): void => {
    this.subjects.map(tuple => tuple[2] = false);
  }

  public changeCheck = (tuple: [ISubject, boolean, boolean]): void => {
    tuple[2] = tuple[1];
    if (typeof tuple[0] === "number") {
      this.selected = tuple[1] ?
        this.selectDate(this.selected, tuple[0]) :
        this.unSelectDate(this.selected, tuple[0]);
    } else {
      if (tuple[1]) {

        const marks: Mark[] = this.marks[tuple[0].id];
        const students = _take(marks, "student");
        this.render.set(tuple[0].id, new Set(students.map(id => this.students[id])));
        console.log(this.render);

        this.dates[tuple[0].id].map(dateTuple => {
          this.selected = this.selectDate(this.selected, dateTuple[0]);
          dateTuple[1] = tuple[1];
        });
      } else {
        this.dates[tuple[0].id].map(dateTuple => {
          this.selected = this.unSelectDate(this.selected, dateTuple[0]);
          dateTuple[1] = tuple[1];
        });
      }

    }
  };


  public showStudents = () => {

  };


  private selectDate = (holder: [], date: number): void => {
    if (!holder.includes(date)) {
      holder.push(date);
      holder.sort((a, b) => a - b);
    }

    return holder;
  };

  private unSelectDate = (holder: [], date: number): void => {
    return holder.filter(time => time !== date);
  }

  getFromRender() {
    const representation =  Array.from(this.render);
    representation.forEach(([id, set], i, rep) => {
      rep[i][0] = this.subjects.find(sub => sub[0].id === id)[0].name;
      rep[i][1] = _take(Array.from(set), "surname");
    });
    return representation;
  }
}
