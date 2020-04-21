import { Injectable } from '@angular/core';
import {IStudent} from "../common/models/IStudent";
import {StatisticMapper} from "../common/dataMapper/statistic.mapper";
import {Mark} from "../common/models/IMark";
import {StatisticResearcher} from "../common/helpers/statistics";
import {_partial, _range} from "../common/helpers/lib";
import {ISubject} from "../common/models/ISubject";


enum Performance {
  underperforming,
  passed,
  decent,
  "excellent student",
  unattested,
}

@Injectable({
  providedIn: 'root'
})
export class D3Service {

  constructor() {}

  public getColorScheme = (n: number): {domain: string[]} => ({ domain: (new Array(n)).fill("").map(color => this.getRandomColor()) });

  public getRandomColor = (): string  => {
    const letters: string = "0123456789ABCDEF";
    let color: string = "#";
    for (let i: number = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  public getAverageMarksObject = (
    marks: {[key]: Mark[]},
    subjectId: string,
    students: {[key]: IStudent}
  ): {[key]: number} => {

    const marksArray: {[string]: number[]} = (new StatisticMapper()).getAverageMarksObject(marks, subjectId, students);

    Object.keys(marksArray).forEach(key => {
      marksArray[key] = Math.ceil(StatisticResearcher.getAverageInArray(marksArray[key]));
    });


    return marksArray;
  }

  public getDataForBarFromEntries = (entries: [string, string][]) => {
    return entries
      .reduce((acc: {name: string, value: string}, current: [string, string]) => {
        acc = [...acc, {name: current[0], value: current[1]}];
        return acc;
      }, []);
  };

  public getPerformanceObject = (marks: {name: string, value: string}[]) => {
    return marks.reduce((acc, current) => {
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
    }, {
      underperforming: 0,
      passed: 0,
      decent: 0,
      ["excellent student"]: 0,
    });
  };

  public getEntries = (obj: {}) => [Object.entries(obj)];

  public getPerformanceData = (marks: {name: string, value: string}[], studentsLength: number) => {
    const performance: Performance = this.getPerformanceObject(marks);
    const parsed: {[string]: number}[] = this.getDataForBarFromEntries(Object.entries(performance));
    parsed.unshift({name: "unattested", value: studentsLength - (
      performance.underperforming +
      performance.passed +
      performance.decent +
      performance["excellent student"]
    )});
    return parsed;
  };

  public getDatesObject = (
    students: {[key]: IStudent},
    marks: {[key]: Mark[]},
    selected: number[],
    subjId: string
  ) => {
    return Object.keys(students).reduce((acc, studentId) => {
      const student = students[studentId];
      const key: string = student.name + " " + student.surname;
      const studentsMarks: Mark[] = marks[subjId].filter(m => m.student === student.id);
      const datesMap = studentsMarks.reduce((acc, mk) => {
        const dateForView: string = mk.time;
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
  }

  public applyTendencies = (datesObject: {[key]: string}[]) => {
    const data = [...datesObject];
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
    data.push({name: "Class tendency", series: tendency});
    return data;
  };

  public sortEntries = (
    entries: [string, string][]
  ): [string, string][]  => [entries.sort((a, b) => +b[1] - +a[1])];

  public generateDateScale = (selected: number[], step: string) => {
    const ONE_DAY: number = 1000 * 24 * 60 * 60;
    const ONE_WEEK: number  = ONE_DAY * 7;
    const ONE_MONTH: number = ONE_DAY * 31;
    const rangeBy: Function = _partial(_range, ...selected);

    if (step === "date") {
      return rangeBy(ONE_DAY);
    } else if (step === "week") {
      return rangeBy(ONE_WEEK);
    } else if (step === "month") {
      return rangeBy(ONE_MONTH);
    }

  };

  public generateMarksInScale = (
    scale: [number, number],
    step: string,
    marks: {[key]: Mark},
    subject: [ISubject, boolean, boolean][]
  ) => {
    return scale.reduce((acc, date, index, scale) => {
      let filterFn: Function = (from, to?) => ([subjectId, mrks]) => {
        if (to) {
          return [subjectId, mrks.filter(mark => mark.time >= from && mark.time < to)]
        } else {
          return [subjectId, mrks.filter(mark => mark.time === date)]
        }
      };
      if (step === "date") {
        acc = [...acc, {name: (new Date(date)).toLocaleDateString(), series: Object.entries(marks)
          .map(filterFn(date))
          .filter(day => day[1].length)
          .reduce((acc, entry) => {
            const tuple: string = subject.find(sub => sub[0].id === entry[0]);
            if (tuple) {
              acc = [...acc, {name: tuple[0].name, value: entry[1].length}];
            }



            return acc;
          }, [])}];
      } else {
        let name: string;
        if (step === "month") {
          name = (new Date(date)).toLocaleString("default", {month: "long"});
        } else {
          name = `${
            (new Date(date)).toLocaleString("default", {day: "numeric", month: "short"})
            } — ${
            (new Date(scale[index + 1] - 1000 * 24 * 60 * 60)).toLocaleString("default", {day: "numeric", month: "short"})
            }`;
        }
        if (scale[index + 1]) {
          acc = [...acc, {name, series: Object.entries(marks)
            .map(filterFn(date, scale[index + 1]))
            .filter(day => day[1].length)
            .reduce((acc, entry) => {

              const tuple: string = subject.find(sub => sub[0].id === entry[0]);
              if (tuple) {
                acc = [...acc, {name: tuple[0].name, value: entry[1].length}];
              }
              return acc;
            }, [])}];
        }
      }


      return acc;
    }, []);
  }
}
