import {Component, OnInit} from "@angular/core";

// ngxs
import * as Ngxs from "@ngxs/store";
import {SubjectTableState} from "../../../@ngxs/subjects/subjects.state";
import {Subjects} from "../../../@ngxs/subjects/subjects.actions";
import {Marks} from "../../../@ngxs/marks/marks.actions";
import {Observable} from "rxjs";
import {ISubject} from "../../common/models/ISubject";
import {_take, copyByJSON} from "../../common/helpers/lib";
import {IStudent} from "../../common/models/IStudent";
import {Mark} from "../../common/models/IMark";
import {ControlValueAccessor, FormControl, FormGroup} from "@angular/forms";
import {StatisticMapper} from "../../common/dataMapper/statistic.mapper";
import {ITableConfig, TableBody, TableRow} from "../../common/models/ITableConfig";
import {Select} from "@ngxs/store";
import {NgxsStatisticsState, StatisticsStateModel} from "../../@ngxs/statistics/statistics.state";
import {Statistics} from "../../@ngxs/statistics/statistics.actions";
import {startWith} from "rxjs/internal/operators";

@Component({
  selector: "app-statistics",
  templateUrl: "./statistics.component.html",
  styleUrls: ["./statistics.component.sass"],
})
export class StatisticsComponent implements OnInit, ControlValueAccessor {

  public state$: Observable<SubjectTableState>;
  public selectorType: string;
  public mapper: StatisticMapper;
  public tableBody: TableBody;
  public render: ITableConfig[] = [];
  @Select(NgxsStatisticsState.Statistics) public state$: Observable<StatisticsStateModel>;

  // [subj, checked, expaneded]
  public subjects: [ISubject, boolean, boolean][];
  public students: Observable<IStudent[]>;
  public marks: Observable<Mark[]>;
  public dates: [number, boolean, boolean][];

  // form
  public selected: [number, number] = [];
  public isHidden: boolean = true;
  public dateSelector: FormGroup;

  constructor(
    private store: Ngxs.Store
  ) {
    this.mapper = new StatisticMapper(this.store);
    this.tableBody = new TableBody(TableRow);
  }

  public ngOnInit(): void {

    this.state$.subscribe(({students, marks, dates, subjects, selectorType}) => {
      this.subjects = copyByJSON(subjects);
      this.students = copyByJSON(students);
      this.marks = copyByJSON(marks);
      this.dates = copyByJSON(dates);
      this.selectorType = selectorType;
    });

    this.dateSelector = new FormGroup({
      from: new FormControl(""),
      to: new FormControl("")
    });
  }

  public checkOne = (tuple: [any, boolean, boolean]): void => tuple[1] = true;

  public uncheckOne = (tuple: [any, boolean, boolean]): void => tuple[1] = false;

  public expandOne = (tuple: [any, boolean, boolean]): void => {
    tuple[2] = true;
  };

  public collapseOne = (tuple: [any, boolean, boolean]): void => tuple[2] = false;

  public checkAll = (): void => {
    this.subjects.map(this.checkOne);
    Object.values(this.dates).forEach(dates => dates.map(tuple => {
      this.checkOne(tuple);
      this.selected = this.selectDate(this.selected, tuple[0]);
    }));
    this.selected.sort((a, b) => a - b);
    this.render.length = 0;
    this.render = this.subjects
      .map(tuple => this.generateStatisticViewForSubject(
        tuple, this.render, this.dates, this.marks, this.students
      ))
      .flat(1);
  };

  public unCheckAll = (): void => {
    this.subjects.map(this.uncheckOne);
    Object.values(this.dates).forEach(dates => dates.map(this.uncheckOne));
    this.selected.length = 0;
    this.render.length = 0;
  };

  public expandAll = (): void => {
    this.subjects.map(this.expandOne);
  };

  public collapseAll = (): void => {
    this.subjects.map(this.collapseOne);
  };

  public changeCheck = (tuple: [ISubject, boolean, boolean], date?: [number, boolean, boolean]): void => {

    if (date) {




      const index: number = this.render.findIndex(config => config.caption.includes(tuple[0].name));

      if (date[1]) {

        this.selected = [...this.selectDate(this.selected, date[0])];
        this.checkOne(tuple);


        if (this.render.some(config => config.caption.includes(tuple[0].name))) {

          this.replaceAtIndex(
            this.render,
            index,
            this.mapper.statisticForTable(
              tuple, this.dates, this.marks, this.students, this.selected
            ),
            this.mapper.getHeaders(
              this.dates, tuple, this.selected
            )
          );

        } else {

          this.render = this.generateStatisticViewForSubject(
            tuple, this.render, this.dates, this.marks, this.students, this.mapper.statisticForTable, this.selected
          );

        }
      } else {

        this.selected = this.unSelectDate(this.selected, date[0]);

        if (!this.dates[tuple[0].id].some(dateTuple => dateTuple[1])) {

          this.uncheckOne(tuple);
          this.render = this.removeSubjectStatisticFromView(tuple, this.render);

        } else {

          this.replaceAtIndex(
            this.render,
            index,
            this.mapper.statisticForTable(
              tuple, this.dates, this.marks, this.students, this.selected
            ),
            this.mapper.getHeaders(
              this.dates, tuple, this.selected
            )
          );

        }
      }

    }

    if (!date) {

      if (tuple[1]) {

        this.dates[tuple[0].id].map(dateTuple => {

          this.checkOne(dateTuple);
          this.selected = [...this.selectDate(this.selected, dateTuple[0])]

        });

        this.render = this.generateStatisticViewForSubject(
          tuple, this.render, this.dates, this.marks, this.students
        );

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
    const headers: number[] = this.mapper.getHeaders(dates, subjectTuple, selectedDatesArray);








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

  public replaceAtIndex = (
    tableConfig: ITableConfig[],
    index: number,
    body: ITableConfig,
    headers: string[],
  ): ITableConfig[] => {
    tableConfig[index].body = body;
    tableConfig[index].headers = headers;
  };



  public selectDate = (holder: [], date: number): void => {
    if (!holder.includes(date)) {
      holder.push(date);
      holder.sort((a, b) => a - b);
    }

    return holder;
  };

  public unSelectDate = (holder: [], date: number): void => holder.filter(time => time !== date);

  public getSelected = (subjects: [ISubject, Boolean, Boolean][]): void => subjects.filter(tuple => tuple[1]);

  public changeSelectionType(value: string): void {
      this.store.dispatch(new Statistics.ChangeSelector(value));
  }

  public showChanges(value: any): void {
    function getDateOfWeek(y: string, w: string): Date {
      let date: Date = new Date(y, 0, (1 + (w - 1) * 7));
      date.setDate(date.getDate() + (1 - date.getDay()));
      return date;
    }
    const parseWeek: Function = (weekString: string): [string, string] => weekString.split("-W");

    let start: number, end: number;
    if (this.selectorType === "week") {
      start = getDateOfWeek(...parseWeek(value.from)).getTime();
      end = getDateOfWeek(...parseWeek(value.to)).getTime();
    } else {
      start = (new Date(value.from)).getTime();
      end = (new Date(value.to)).getTime();
    }


    this.selected = [start, end];

  }
}
