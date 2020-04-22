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
import {ControlValueAccessor, FormControl, FormGroup, Validators} from "@angular/forms";
import {StatisticMapper} from "../../common/dataMapper/statistic.mapper";
import {ITableConfig, TableBody, TableRow} from "../../common/models/ITableConfig";
import {Select} from "@ngxs/store";
import {NgxsStatisticsState, StatisticsStateModel} from "../../@ngxs/statistics/statistics.state";
import {DatePipe} from "@angular/common";

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
  public range: [number, number] = [];
  public isHidden: boolean = true;
  public dateSelector: FormGroup;
  public statSelector: FormGroup;

  constructor(
    private store: Ngxs.Store,
    private datePipe: DatePipe
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
      from: new FormControl("", [Validators.required]),
      to: new FormControl("", [Validators.required]),
      selector: new FormControl("date")
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
    this.subjects = [...this.subjects];
  };

  public unCheckAll = (): void => {
    this.subjects.map(this.uncheckOne);
    Object.values(this.dates).forEach(dates => dates.map(this.uncheckOne));
    this.selected.length = 0;
    this.subjects = [...this.subjects];
  };

  public expandAll = (): void => {
    this.subjects.map(this.expandOne);
  };

  public collapseAll = (): void => {
    this.subjects.map(this.collapseOne);
  };

  public changeCheck = (tuple: [ISubject, boolean, boolean], date?: [number, boolean, boolean]): void => {

    if (date) {

      if (date[1]) {

        this.selected = [...this.selectDate(this.selected, date[0])];
        this.checkOne(tuple);


      } else {

        this.selected = this.unSelectDate(this.selected, date[0]);

        if (!this.dates[tuple[0].id].some(dateTuple => dateTuple[1])) {

          this.uncheckOne(tuple);

        }
      }

    }

    if (!date) {


      if (tuple[1]) {

        this.dates[tuple[0].id].map(dateTuple => {

          this.checkOne(dateTuple);
          this.selected = [...this.selectDate(this.selected, dateTuple[0])]
        });

      } else {

        this.dates[tuple[0].id].map(dateTuple => {
          this.uncheckOne(dateTuple);
          this.selected = this.unSelectDate(this.selected, dateTuple[0]);
        });

      }
    }

    this.subjects = [...this.subjects];
  };

  public getSelected = (subjects: [ISubject, boolean, boolean][]) => subjects.filter(tuple => tuple[1]);

  public selectDate = (holder: [], date: number): void => {
    if (!holder.includes(date)) {
      holder.push(date);
      holder.sort((a, b) => a - b);
    }

    return holder;
  };

  public unSelectDate = (holder: [], date: number): void => holder.filter(time => time !== date);

  public showChanges = ($event: event): void => {
    $event.preventDefault();
    const value: any = this.dateSelector.value;
    this.range = [this.handleTimeString(value.from), this.handleTimeString(value.to)];
  };

  public handleTimeString = (time: string) => {
    const splited: string[] = time.split("-");

    const getDateOfWeek: Function = (y: string, w: string): Date => {
      let date: Date = new Date(y, 0, (1 + (w - 1) * 7));
      date.setDate(date.getDate() + (1 - date.getDay()));
      return date;
    };

    const parseWeek: Function = (weekString: string): [string, string] => weekString.split("-W");

    if (splited.length === 2 && splited[1].includes("W")) {
      return getDateOfWeek(...parseWeek(time)).getTime();
    }

    return (new Date(time)).getTime();

  };

  public mapTimestamp = (timestamp: number) => {
    if (timestamp) {

      if (this.dateSelector.get("selector").value === "date") {
        return this.datePipe.transform(timestamp, "yyyy-MM-dd");
      }

      if (this.dateSelector.get("selector").value === "week") {
        const splited: string[] = this.datePipe.transform(timestamp, "yyyy-ww").split("-");
        splited.splice(1, 0, "-W");
        return splited.join("");
      }

      if (this.dateSelector.get("selector").value === "month") {
        return this.datePipe.transform(timestamp, "yyyy-MM");
      }

    }
  }
}
