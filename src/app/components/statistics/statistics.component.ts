import {Component, OnInit} from "@angular/core";

// ngxs
import * as Ngxs from "@ngxs/store";
import {SubjectTableState} from "../../../@ngxs/subjects/subjects.state";
import {Subjects} from "../../../@ngxs/subjects/subjects.actions";
import {Marks} from "../../../@ngxs/marks/marks.actions";
import {Observable} from "rxjs";
import {ISubject} from "../../common/models/ISubject";
import {__filter, _chain, _compose, _if, _partial, _pluck, _take, copyByJSON} from "../../common/helpers/lib";
import {IStudent} from "../../common/models/IStudent";
import {Mark} from "../../common/models/IMark";
import {ControlValueAccessor} from "@angular/forms";
import {tap} from "rxjs/internal/operators";
import {StatisticMapper} from "../../common/dataMapper/statistic.mapper";
import {ITableConfig, TableBody, TableRow} from "../../common/models/ITableConfig";
import {mark} from "@angular/compiler-cli/src/ngtsc/perf/src/clock";
import {compareSegments} from "@angular/compiler-cli/ngcc/src/sourcemaps/segment_marker";
@Component({
  selector: "app-statistics",
  templateUrl: "./statistics.component.html",
  styleUrls: ["./statistics.component.sass"],
})
export class StatisticsComponent implements OnInit, ControlValueAccessor {

  public state$: Observable<SubjectTableState>;
  public mapper: StatisticMapper;
  public tableBody: TableBody;
  public render: ITableConfig[] = [];
  /*
  {
    caption: "Statistics for subjects:",
    headers: [],
    body: []
  }
   */

  // [subj, checked, expaneded]
  public subjects: [ISubject, boolean, boolean][];
  public students: Observable<IStudent[]>;
  public marks: Observable<Mark[]>;
  public dates: [number, boolean, boolean][];

  // form
  public selected: [number, number] = [];
  public isHidden: boolean = true;

  constructor(
    private store: Ngxs.Store
  ) {
    this.mapper = new StatisticMapper(this.store);
    this.tableBody = new TableBody(TableRow);
    this.state$ = this.mapper.fromState();
  }

  public ngOnInit(): void {

    this.state$.pipe(
      tap(([subjects, students, marks]) => {
        this.subjects = this.mapper.subjectsFromState(subjects);

        this.marks =  this.mapper.marksFromState(this.subjects, marks);

        this.dates = this.mapper.datesFromState(this.subjects, this.marks);

        this.students = this.mapper.studentsFromState(students);
      })
    ).subscribe();

  }

  public checkOne = (tuple: [any, boolean, boolean]): void => tuple[1] = true;

  public uncheckOne = (tuple: [any, boolean, boolean]): void => tuple[1] = false;

  public expandOne = (tuple: [any, boolean, boolean]): void => tuple[2] = true;

  public collapseOne = (tuple: [any, boolean, boolean]): void => tuple[2] = false;

  public checkAll = (): void => {
    this.subjects.map(this.checkOne);
    Object.values(this.dates).forEach(dates => dates.map(tuple => {
      this.checkOne(tuple);
      this.selected = this.selectDate(this.selected, tuple[0]);
    }));
    this.selected.sort((a, b) => a - b);
    this.render.length = 0;
    this.subjects.map(tuple => {
      this.render = this.generateStatisticViewForSubject(tuple, this.render, this.dates, this.marks, this.students);
    });

  };

  public unCheckAll = (): void => {
    this.subjects.map(this.uncheckOne);
    Object.values(this.dates).forEach(dates => dates.map(this.uncheckOne));
    this.selected.length = 0;
    this.subjects.map(tuple => {
      this.render = this.removeSubjectStatisticFromView(tuple, this.render);
    });
  };

  public expandAll = (): void => {
    this.subjects.map(this.expandOne);
  };

  public collapseAll = (): void => {
    this.subjects.map(this.collapseOne);
  };

  public changeCheck = (tuple: [ISubject, boolean, boolean], date?: [number, boolean, boolean]): void => {

    // tuple[2] = tuple[1];

    if (date) {
      if (date[1]) {

        this.selected = this.selectDate(this.selected, date[0]);
        this.checkOne(tuple);

        if (this.render.some(config => config.caption.includes(tuple[0].name))) {
          this.render = this.removeSubjectStatisticFromView(tuple, this.render);
        }
        this.render = this.generateStatisticViewForSubject(
          tuple, this.render, this.dates, this.marks, this.students, this.mapper.statisticForTable, this.selected
        );

      } else {

        this.selected = this.unSelectDate(this.selected, date[0]);
        if (this.render.some(config => config.caption.includes(tuple[0].name))) {
          this.render = this.removeSubjectStatisticFromView(tuple, this.render);
        }

        if (!this.dates[tuple[0].id].some(dateTuple => dateTuple[1])) {
          this.uncheckOne(tuple);
        } else {
          this.render = this.generateStatisticViewForSubject(
            tuple, this.render, this.dates, this.marks, this.students, this.mapper.statisticForTable, this.selected
          );
        }
      }

    }

    if (!date) {
      if (tuple[1]) {
        this.dates[tuple[0].id].map(dateTuple => {
          this.checkOne(dateTuple);
          this.selectDate(this.selected, dateTuple[0]);
        });
        this.render = this.generateStatisticViewForSubject(tuple, this.render, this.dates, this.marks, this.students);
      } else {
        this.dates[tuple[0].id].map(dateTuple => {
          this.uncheckOne(dateTuple);
          this.selected = this.unSelectDate(this.selected, dateTuple[0]);
        });
        this.render = this.removeSubjectStatisticFromView(tuple, this.render);
      }

    }
  };

  public generateStatisticViewForSubject = (
    subjectTuple: [ISubject, boolean, boolean],
    tableConfigArray: ITableConfig[],
    dates: {[string]: [number, boolean, boolean][]},
    marks: {[string]: Mark[]},
    students: {[string]: IStudent},
    statisticGenerator: () => string[] = this.mapper.statisticForTable,
    selectedDatesArray?: number[]
  ): ITableConfig[] => {
    const headers: number[] = !selectedDatesArray ?
      dates[subjectTuple[0].id].map(dateTuple => dateTuple[0]) :
      dates[subjectTuple[0].id].filter(dateTuple => selectedDatesArray.includes(dateTuple[0])).map(dateTuple => dateTuple[0]);
    return [...tableConfigArray, {
      caption: `Statistic for ${subjectTuple[0].name}:`,
      body: statisticGenerator(subjectTuple, dates, marks, students, selectedDatesArray),
      headers
    }];
  };

  public removeSubjectStatisticFromView = (
    subjectTuple: [ISubject, boolean, boolean],
    tableConfigArray: ITableConfig[]
  ) => {
    const copy: ITableConfig[] = copyByJSON(tableConfigArray);
    const beginFrom: number = copy.findIndex(config => config.caption.includes(subjectTuple[0].name));
    copy.splice(beginFrom, 1);
    return copy;
  };



  public selectDate = (holder: [], date: number): void => {
    if (!holder.includes(date)) {
      holder.push(date);
      holder.sort((a, b) => a - b);
    }

    return holder;
  };

  public unSelectDate = (holder: [], date: number): void => holder.filter(time => time !== date);
}
