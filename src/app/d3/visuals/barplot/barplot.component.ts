import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges} from "@angular/core";
import * as d3 from "d3";


@Component({
  selector: "app-barplot",
  templateUrl: "./barplot.component.html",
  styleUrls: ["./barplot.component.sass"]
})
export class BarplotComponent implements OnInit, OnChanges, AfterViewInit {

  @Input("data") public data: [];
  @Input("index") public index: number;

  constructor() { }

  public ngOnInit(): void {
  }

  public ngAfterViewInit(): void {
    const [subject, marks, dates, students, selected] = this.data;
    if (!Array.isArray(subject[0])) {
      this.createAverageBars(subject, marks, dates, students, selected);
    } else {
      this.createMarksBar(subject, marks, dates, students, selected);
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const [subject, marks, dates, students, selected] = changes.data.currentValue;
    if (!Array.isArray(subject[0])) {
      this.createAverageBars(subject, marks, dates, students, selected);
    } else {
      this.createMarksBar(subject, marks, dates, students, selected);
    }

  }

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
    }, {});


    function getRandomColor() {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }
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
      //.style("padding", "0.2rem")
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
        return (new Date(d)).toDateString()
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
      .style("position", "absolute")
    legendsValue.map(entry => {
      d3.select(".legend").append("div").text(entry[0]).style("background", entry[1]).style("padding", "0.3rem");
    })


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
          })
        }
      }
    });



  };


  public createAverageBars = (subject, marks, dates, students, selected): void => {
    const map = marks[subject[0].id].reduce((dictionary, mark) => {
      const id: string = mark.student;
      const value: number = mark.value;
      dictionary[id] = dictionary[id] !== undefined ? [...dictionary[id], value] : [value];
      return dictionary;
    }, {});
    const average = Object.entries(map).map(entry => {
      entry[1] = (entry[1].reduce((acc, curr) => acc + curr) / entry[1].length).toFixed(2);
      return entry;
    }).sort((a, b) => b[1] - a[1]);
    const divider: Function = ([, mark]): string => {
      if (mark <= 4 ) {
        return "blue";
      } else if (mark <= 6) {
        return "#69b3a2";
      } else if (mark <= 8) {
        return "green";
      } else {
        return "yellowgreen";
      }
    };
    const toName: Function = ([id, value]) => students[id].name + " " + students[id].surname + ": " + value;
    const selector: string = `.barplot${this.index}`;
    d3.select("app-barplot " + selector)
      .style("height", "20rem")
      .style("width", "30rem")
      .style("display", "flex")
      .style("align-items", "flex-start")
      .style("flex-direction", "column")
      .selectAll("div")
      .data(average)
      .enter()
      .append("div")
      .style("display", "flex")
      .style("background", divider)
      .style("width", (([, mark]) => mark * 10 + "%"))
      .style("height", "2rem")
      .append("span")
      .text(toName)
      .style("display", "flex")
      .style("transform", "scale(0.8)")
  }

}
