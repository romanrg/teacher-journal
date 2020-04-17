import {AfterViewInit, ChangeDetectionStrategy, Component, DoCheck, Input, OnChanges, OnInit, SimpleChanges} from "@angular/core";
import * as d3 from "d3";
import {ISubject} from "../../../common/models/ISubject";
import {IStudent} from "../../../common/models/IStudent";

@Component({
  selector: "app-barplot",
  templateUrl: "./barplot.component.html",
  styleUrls: ["./barplot.component.sass"],
})
export class BarplotComponent implements OnInit, OnChanges, AfterViewInit, DoCheck {

  @Input("data") public data: [];
  @Input("index") public index: number;
  @Input("show") public whatToShow: any;
  public colorSchemeDates: {domain: string[]} = {
    domain: []
  };
  public colorSchemePerformance: {domain: string[]} = {
    domain: []
  };
  public marks = [
    {name: "John Dohn", value: "9.6"},
    {name: "John Don", value: "6"},
    {name: "Joe Dohn", value: "9"},
    {name: "Jo Do", value: "9.1"},
  ];

  public view: [number, number] = [940, 480];
  public showXAxis = true;
  public showYAxis = true;
  public gradient = false;
  public showLegend = false;
  public showXAxisLabel = true;
  public xAxisLabel = "Marks";
  public showYAxisLabel = true;
  public yAxisLabel = "Students";

  public byDates = [];
  public heatMap = [];
  public xAxisLabelByDates = "Dates";
  public yAxisLabelByDates = "Students";

  public byPerformance: any[] = [];

  constructor() { }

  public ngOnInit(): void {
    const [subject, marks, dates, students, selected] = this.data;
    this.createAverageBars(subject, marks, dates, students, selected);
    this.createByDates(subject, marks, dates, students, selected);
  }

  public createByDates = (
    subject: [ISubject],
    marks: {[string]: Mark[]},
    dates: {[string]: [number, boolean, boolean]},
    students: {[string]: IStudent},
    selected: number[]
    ): void => {
    const subjId: string = subject[0].id;
    const data = Object.keys(students).reduce((acc, studentId) => {
      const student = students[studentId];
      const key: string = student.name + " " + student.surname;
      const studentsMarks: Mark[] = marks[subjId].filter(m => m.student === student.id);
      const datesMap = studentsMarks.reduce((acc, mk) => {
        const dateForView: string = /*(new Date(mk.time)).toDateString();*/mk.time
        if (selected.includes(mk.time)) {
          if (acc[dateForView] === undefined) {
            acc[dateForView] = [mk.value]
          } else {
            acc[dateForView] = [...acc[dateForView], mk.value]
          }
        }
        return acc;
      }, {});

      const keys = Object.keys(datesMap).sort((a, b) => a - b);

      const series = keys.reduce((acc, dateKey) => {
        acc = [...acc, {name: (new Date(+dateKey)).toDateString(), value: datesMap[dateKey]}]
        return acc;
      },[])
      acc = [...acc, {name: key, series}];
      return acc;
    }, []);
    this.heatMap = [...data].sort((a, b) => b.series.length - a.series.length);
    const uniqueDates = data.reduce((acc, curr) => {
      curr.series.map(({name, value}) => {
        acc[name] = [];
      });
      return acc;
    }, {});
    Object.keys(uniqueDates).map(key => {
      data.map(({series}) => {
        series.map(({name, value}) => {
          if (key === name) {
            uniqueDates[key] = [...uniqueDates[key], ...value];
          }
        });
      })
    });
    Object.keys(uniqueDates).map(key => {
      uniqueDates[key] = (uniqueDates[key].reduce((acc, curr) => acc + curr, 0) / uniqueDates[key].length).toFixed(2);
    });
    const tendency = Object.keys(uniqueDates).reduce((acc, key) => {
      acc = [...acc, {name: key, value: uniqueDates[key]}];
      return acc;
    }, []);
    data.push({name: "Class tendency", series: tendency})
    this.byDates = data;

  };

  public ngOnChanges(changes: SimpleChanges): void {
    /*
    if (changes.whatToShow.currentValue) {
      this.whatToShow = {...changes.whatToShow.currentValue};
    }
    */
    const [subject, marks, dates, students, selected] = changes.data.currentValue;

    this.createAverageBars(subject, marks, dates, students, selected);
    this.createByDates(subject, marks, dates, students, selected);

  }

  public generateColorScheme = (n: number) => {
    function getRandomColor(): string {
      const letters = "0123456789ABCDEF";
      let color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }
    const scheme: string[] = (new Array(n)).fill("").map(color => getRandomColor());
    return scheme;
  };

  public createAverageBars = (
    subject: [ISubject],
    marks: {[string]: Mark[]},
    dates: {[string]: [number, boolean, boolean]},
    students: {[string]: IStudent}
    ): void => {
    const averageMarks: {[string]: number[]} = marks[subject[0].id].reduce((acc, mark) => {
      const student: string = students[mark.student].name + " " + students[mark.student].surname;
      if (acc[student] === undefined) {
        acc[student] = [mark.value];
      } else {
        acc[student] = [...acc[student], mark.value];
      }
      return acc;
    },                                                                     {});
    Object.keys(averageMarks).forEach(key => {
      averageMarks[key] = Math.ceil((
        averageMarks[key].reduce(
          (acc, curr) => acc + curr
        ) / averageMarks[key].length
      ).toFixed(2));
    });
    this.marks = Object.entries(averageMarks)
      .sort((a, b) => +b[1] - +a[1])
      .reduce((acc: {name: string, value: string}, current: [string, string]) => {
        acc = [...acc, {name: current[0], value: current[1]}];
        return acc;
      },      []);
    if (!this.colorSchemeDates.domain.length) {
      this.colorSchemeDates = { domain: this.generateColorScheme(this.marks.length) }
    }

    const performance = this.marks.reduce((acc, current) => {
      if (current.value <= 4) {
        acc.underperforming++;
      } else if (current.value <= 6) {
        acc.passed++;
      } else if (current.value <= 8) {
        acc.decent++;
      } else {
        acc["excellent student"]++;
      }
      return acc;
    },                                    {
      underperforming: 0,
      passed: 0,
      decent: 0,
      ["excellent student"]: 0,
    });
    const parsed = Object.keys(performance).reduce((acc, key) => {
      acc = [...acc, {name: key, value: performance[key]}];
      return acc;
    },                                             []);
    parsed.unshift({name: "unattested", value: Object.keys(students).length - (
      performance.underperforming +
      performance.passed +
      performance.decent +
      performance["excellent student"]
    )});
    this.byPerformance = parsed;
    if (!this.colorSchemePerformance.domain.length) {
      const domain = this.generateColorScheme(5);
      this.colorSchemePerformance = {domain};
    }

  }

  public onSelect = ($event: Event): void => {
    console.log($event);
  }

  public getStudentTitle(student: any): string {
    return Object.values(student)[0]
  }
}
