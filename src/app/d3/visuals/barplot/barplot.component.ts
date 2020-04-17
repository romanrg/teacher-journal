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

  public colorSchemeSubjects: {domain: string[]} = {
    domain: []
  };
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

  public view: [number, number] = [640, 340];
  public showXAxis = true;
  public showYAxis = true;
  public gradient = false;
  public showLegend = false;
  public showXAxisLabel = true;
  public xAxisLabel = "Marks";
  public showYAxisLabel = true;
  public yAxisLabel = "Students";

  public byDates = [];
  public xAxisLabelByDates = "Dates";
  public yAxisLabelByDates = "Students";

  public byPerformance: any[] = [];
  public explodeSlices: boolean = false;
  public doughnut: boolean = false;

  constructor() { }

  public ngOnInit(): void {
    const [subject, marks, dates, students, selected] = this.data;
    this.createAverageBars(subject, marks, dates, students, selected);
    this.createByDates(subject, marks, dates, students, selected);
  }
  /*
  public ngDoCheck(): void {
      const [subject, marks, dates, students, selected] = this.data;
      this.createAverageBars(subject, marks, dates, students, selected);
      this.createByDates(subject, marks, dates, students, selected);
  }
  */


  public createByDates = (
    subject: [ISubject],
    marks: {[string]: Mark[]},
    dates: {[string]: [number, boolean, boolean]},
    students: {[string]: IStudent},
    selected: number[]
    ): void => {
    const subjId: string = subject[0].id;
    //
    const map: any = dates[subjId].reduce((acc, [timestamp, checked, expanded]) => {
      if (checked) {
        const dateForView: string = (new Date(timestamp)).toDateString();
        acc[dateForView] = marks[subjId].filter(mark => mark.time === timestamp).map(mark => {
          const student: string = students[mark.student].name + " " + students[mark.student].surname;
          return {name: student, value: mark.value};
        });
      }
      return acc;
      },                                  {});
    this.byDates = Object.keys(map).reduce((acc, dateKey) => {
        acc = [...acc, {name: dateKey, series: map[dateKey]}];
        return acc;
      },                                   []).map(value => {
        value.series = value.series.sort((a, b) => b.value - a.value);
        return value;
      });
  };

  public ngOnChanges(changes: SimpleChanges): void {
    const [subject, marks, dates, students, selected] = changes.data.currentValue;
    this.createAverageBars(subject, marks, dates, students, selected);
    this.createByDates(subject, marks, dates, students, selected);

  }

  public ngAfterViewInit(): void {
    /*
    const [subject, marks, dates, students, selected] = this.data;
    this.createAverageBars(subject, marks, dates, students, selected);
    this.createByDates(subject, marks, dates, students, selected);
    */
  }
  /*

  public createMarksBar = (subjects, marks, dates, students, selected) => {
    const dateRange = [selected[0], selected[selected.length - 1]];
    const ONE_DAY = 1000 * 24 * 60 * 60;
    const generateDays: Function = ([start, end]: [number, number]) => {
      const result = [];

      while (start <= end) {
        result.push(start);
        start = start + ONE_DAY;
      }
      return result;
    };
    const map = {};

    const colormap = subjects.reduce((map, sub) => {
      map[sub[0].name] = getRandomColor();
      return map;
    },                               {});

    Object.entries(marks).map(([subjectId, marksArr]) => {
      marksArr.forEach(mark => {
        if (map[mark.time] === undefined) {
          map[mark.time] = {subjectId: [mark]};
        } else {
          if (map[mark.time][subjectId] === undefined) {
            map[mark.time][subjectId] = [mark];
          } else {
            map[mark.time][subjectId] = [...map[mark.time][subjectId], mark];
          }
        }
      });
    });
    const barData = {};
    const days = generateDays(dateRange);
    Object.keys(map).map(timestamp => {
      if (days.includes(+timestamp)) {
        if (barData[timestamp] === !undefined) {
          barData[timestamp] = [...barData[timestamp], map[timestamp]];
        } else {
          barData[timestamp] = map[timestamp];
        }
      }
    });
    const getData = (data, day, subjects) => {
        const subjectsId = Object.keys(data).splice(1, Object.keys(data).length);
        const equalMarks = subjectsId.map(id => marks[id]).map(arr => arr.filter(mk => mk.time === day));
        return equalMarks.map(mks => [subjects.map(tup => tup[0]).filter(sub => sub.id === mks[0].subject)[0].name, mks.length]);
    };

    const selector: string = `.barplot${this.index}`;

    const x = d3.scaleLinear().domain([days[0], days[days.length - 1]]).range([0, 30]);
    const step = x(days[1]) - x(days[0]);

    d3.select("app-barplot " + selector)
      .style("height", "30rem")
      .style("width", "20rem")
      .style("display", "flex")
      .style("align-items", "flex-start")
      .style("flex-direction", "column")
      .style("justify-content", "space-between")
      .selectAll("div")
      .data(days)
      .enter()
      .append("div")
      .attr("class", (d) => "container" + d)
      .style("align-items", "center")
      .style("display", "flex")
      .style("width", "100%")
      // .style("padding", "0.2rem")
      .style("position", "absolute")
      .style("top", (d) => x(d) + "rem")
      .style("height", step + "rem")
      .append("span").attr("class", "date")
      .style("position", "absolute")
      .style("writing-mode", "vertical-rl")
      .style("left", "-15%")
      .style("font-size", "0.5rem")
      .text((d, i) => {
      if (i === 0 || i === days.length - 1) {
        return (new Date(d)).toDateString();
      }
      });

      // .append("div")
        // .style("display", "flex")
        // .style("background", "red")
        // .text((d) => d)

    const legendsValue: string[] = Object.entries(colormap);
    d3.select("app-barplot " + selector)
      .append("div")
      .attr("class", "legend")
      .style("order", "1")
      .style("transform", "rotate(90deg)")
      .style("top", 40 + "%")
      .style("left", 40 + "%")
      .style("display", "flex")
      .style("left", 40 + "%")
      .style("position", "absolute");
    legendsValue.map(entry => {
      d3.select(".legend").append("div").text(entry[0]).style("background", entry[1]).style("padding", "0.3rem");
    });

    days.forEach(day => {
      if (barData[day]) {
        const time: string = `.container${day}`;
        const data = getData(barData[day], day, subjects);
        if (data.length === 1) {
          d3.select("app-barplot " + selector)
            .selectAll(time)
            .data(data)
            .append("div")
            .style("background", d => colormap[d[0]])
            .style("display", "flex")
            .style("min-height", "100%")
            .style("width", d => d[1] + "rem").enter();
        } else {
          data.forEach((tuple) => {
            d3.select("app-barplot " + selector)
              .selectAll(time)
              .data([tuple])
              .append("div")
              .style("min-height", "100%")
              .style("background", d => colormap[d[0]])
              .style("display", "flex")
              .style("width", d => d[1] + "rem").enter();
          });
        }
      }
    });

  }
  */

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
      ["excellent student"]: 0,
      decent: 0,
      passed: 0,
      underperforming: 0
    });
    const parsed = Object.keys(performance).reduce((acc, key) => {
      acc = [...acc, {name: key, value: performance[key]}];
      return acc;
    },                                             []);
    parsed.push({name: "unattested", value: Object.keys(students).length - (
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
}
