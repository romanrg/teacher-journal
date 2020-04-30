import { Injectable } from "@angular/core";
import {IStudent} from "../common/models/IStudent";
import {StatisticMapper} from "../common/dataMapper/statistic.mapper";
import {Mark} from "../common/models/IMark";
import {StatisticResearcher} from "../common/helpers/statistics";
import {_partial, _range} from "../common/helpers/lib";
import {ISubject} from "../common/models/ISubject";

enum Performance {
  underperforming = 4,
  passed = 6,
  decent = 8,
  excelent = 10,
  unattested,
}
enum PerformanceKey {
  underperforming = "underperforming",
  passed = "passed",
  decent = "decent",
  excelent = "excellent",
  unattested = "unattested",
}
enum TimestampsDefault {
  day = 1000 * 24 * 60 * 60,
  week = 1000 * 24 * 60 * 60 * 7,
  month = 1000 * 24 * 60 * 60 * 31,
}
enum Step {
  date = "date",
  week = "week",
  month = "month"
}
enum Locales {
  default = "default",
  long = "long",
  short = "short",
  numeric = "numeric"
}
enum AveragePerClass {
  name = "Class tendency"
}
enum Numbers16 {
  all = "0123456789ABCDEF"
}
enum ColorStart {
  start = "#"
}

@Injectable({
  providedIn: "root"
})
export class D3Service {

  constructor() {}

  public getColorScheme = (n: any): any =>
    ({ domain: (new Array(n)).fill("").map(color => this.getRandomColor()) })

  public getRandomColor = (): any  => {
    const letters: any = Numbers16.all;
    let color: any = ColorStart.start;
    for (let i: any = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  public getAverageMarksObject = (
    marks: any,
    subjectId: any,
    students: any
  ): any => {

    const marksArray: any = (new StatisticMapper()).getAverageMarksObject(marks, subjectId, students);

    Object.keys(marksArray).forEach((key) => {
      marksArray[key] = Math.ceil(Number.parseInt(StatisticResearcher.getAverageInArray(marksArray[key]), 10));
    });
    return marksArray;
  }

  public getDataForBarFromEntries = (entries: any): any => {
    return entries.reduce((acc: any, current: any) => {
        acc = [...acc, {name: current[0], value: current[1]}];
        return acc;
      },                  []);
  }

  public getPerformanceObject = (marks: any) => {
    return marks.reduce(
      (acc: any, current: any) => {
      if (current.value <= Performance.underperforming) {
        acc[PerformanceKey.underperforming]++;
      } else if (current.value <= Performance.passed) {
        acc[PerformanceKey.passed]++;
      } else if (current.value <= Performance.decent) {
        acc[PerformanceKey.decent]++;
      } else {
        acc[PerformanceKey.excelent]++;
      }
      return acc;
    }, {
      [PerformanceKey.underperforming]: 0,
      [PerformanceKey.passed]: 0,
      [PerformanceKey.decent]: 0,
      [PerformanceKey.excelent]: 0,
    });
  }

  public getEntries = (obj: any) => [Object.entries(obj)];

  public getPerformanceData = (marks: any, studentsLength: any) => {
    const performance: any = this.getPerformanceObject(marks);
    const parsed: any = this.getDataForBarFromEntries(<[string, number][]>Object.entries(performance));
    parsed.unshift({name: PerformanceKey.unattested, value: studentsLength - (
      performance[PerformanceKey.underperforming] +
      performance[PerformanceKey.passed] +
      performance[PerformanceKey.decent] +
      performance[PerformanceKey.excelent]
    )});
    return parsed;
  }

  public getDatesObject = (
    students: any,
    marks:any,
    selected: any,
    subjId: any
  ):{name: string, series: any[]}[] => {
    return Object.keys(students).reduce((acc, studentId) => {
      const student: any = students[studentId];
      const key: any= (new StatisticMapper()).fromStudentToName(student);
      const studentsMarks: any = marks[subjId].filter(m => m.student === student.id);
      const datesMap: any = studentsMarks.reduce((acc, mk) => {
        const dateForView: any = mk.time;
        if (selected.includes(mk.time)) {
          if (acc[dateForView] === undefined) {
            acc[dateForView] = [mk.value];
          } else {
            acc[dateForView] = [...acc[dateForView], mk.value];
          }
        }
        return acc;
      },                                                                {});

      const keys: any = Object.keys(datesMap).sort((a, b) => +a - +b);

      const series: any = keys.reduce((acc, dateKey) => {
        acc = [...acc, {name: (new Date(+dateKey)).toDateString(), value: datesMap[dateKey]}];
        return acc;
      },                                                                                    []);
      acc = [...acc, {name: key, series}];
      return acc;
    },                                  []);
  }

  public applyTendencies = (datesObject: any) => {
    const data: any = [...datesObject];
    const uniqueDates: any = data.reduce((acc, curr: {series: []}) => {
      curr.series.map(({name}) => {
        acc[name] = [];
      });
      return acc;
    },                                   {});
    Object.keys(uniqueDates).map(key => {
      data.map(({series}) => {
        series.map(({name, value}) => {
          if (key === name) {
            uniqueDates[key] = [...uniqueDates[key], ...value];
          }
        });
      });
    });
    Object.keys(uniqueDates).map(key => {
      uniqueDates[key] = StatisticResearcher.getAverageInArray(uniqueDates[key], 2);
    });
    const tendency: any = Object.keys(uniqueDates).reduce((acc, key) => {
      acc = [...acc, {name: key, value: uniqueDates[key]}];
      return acc;
    },                                                                                []);
    data.push({name: AveragePerClass.name, series: tendency});
    return data;

  }

  public sortEntries = (
    entries: any
  ): any  => [entries.sort((a, b) => +b[1] - +a[1])]

  public generateDateScale = (selected: any, step: any) => {
    const rangeBy: any = _partial(_range, ...selected);

    if (step === Step.date) {
      return rangeBy(TimestampsDefault.day);
    } else if (step === Step.week) {
      return rangeBy(TimestampsDefault.week);
    } else if (step === Step.month) {
      return rangeBy(TimestampsDefault.month);
    }

  }

  public generateMarksInScale = (
    scale: any,
    step: any,
    marks: any,
    subject: any
  ) => {
    return scale.reduce((acc, date, index, scale) => {

      let filterFn: Function = (from, to?) => ([subjectId, mrks]) => {
        if (to) {
          return [subjectId, mrks.filter(mark => mark.time >= from && mark.time < to)];
        } else {
          return [subjectId, mrks.filter(mark => mark.time === date)];
        }
      };
      if (step === Step.date) {
        acc = [...acc, {name: (new Date(date)).toLocaleDateString(), series: Object.entries(marks)
          .map(filterFn(date))
          .filter(day => day[1].length)
          .reduce((acc: any[], entry) => {
            const tuple: [ISubject, boolean, boolean] = subject.find(sub => sub[0].id === entry[0]);
            if (tuple) {
              acc = [...acc, {name: tuple[0].name, value: entry[1].length}];
            }

            return acc;
          },      [])}];
      } else {
        let name: any;
        if (step === Step.month) {
          name = (new Date(date)).toLocaleString(Locales.default, {month: Locales.long});
        } else {
          name = `${
            (new Date(date)).toLocaleString(Locales.default, {day: Locales.numeric, month: Locales.short})
            } — ${
            (new Date(scale[index + 1] - TimestampsDefault.day)).toLocaleString(Locales.default, {
              day: Locales.numeric, month: Locales.short
            })
            }`;
        }
        if (scale[index + 1]) {
          acc = [...acc, {name, series: Object.entries(marks)
            .map(filterFn(date, scale[index + 1]))
            .filter(day => day[1].length)
            .reduce((acc: { name: any; value: any; }[], entry) => {

              const tuple: [ISubject, boolean, boolean] = subject.find(sub => sub[0].id === entry[0]);
              if (tuple) {
                acc = [...acc, {name: tuple[0].name, value: entry[1].length}];
              }
              return acc;
            },      [])}];
        }
      }

      return acc;
    },                  []);
  }
}
