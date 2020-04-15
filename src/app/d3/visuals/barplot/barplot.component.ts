import {Component, Input, OnChanges, OnInit, SimpleChanges} from "@angular/core";
import * as d3 from "d3";

@Component({
  selector: "app-barplot",
  templateUrl: "./barplot.component.html",
  styleUrls: ["./barplot.component.sass"]
})
export class BarplotComponent implements OnInit, OnChanges {

  @Input("data") public data: [];

  public options: {height: string, width: string} = {width: 640, height: 480};

  constructor(
  ) { }

  public ngOnInit(): void {
      const [subjects, marks, dates, students, selected] = this.data;
      this.createBars(subjects, marks, dates, students, selected);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const [subjects, marks, dates, students, selected] = changes.data.currentValue;
    this.createBars(subjects, marks, dates, students, selected);
  }


  public createBars(subjects, marks, dates, students, selected): void {
    const checked = subjects.filter(tuple => tuple[1] === true);
    console.log(checked);
    const stats = checked.map(check => {
      const map = marks[check[0].id].reduce((dictionary, mark) => {
        const id: string = mark.student;
        const value: number = mark.value;
        dictionary[id] = dictionary[id] !== undefined ? [...dictionary[id], value] : [value];
        return dictionary;
      }, {});
      const avarage = Object.entries(map).map(entry => {
        entry[1] = (entry[1].reduce((acc, curr) => acc + curr) / entry[1].length).toFixed(2);
        return entry;
      }).sort((a, b) => a[1] - b[1]);
      return avarage
    });

    console.log(stats);


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
    stats.forEach(average => {
      d3.select(".barplot")
        .style("height", "20rem")
        .style("width", "30rem")
        .style("display", "flex")
        .style("align-items", "flex-end")
        .style("justify-content", "space-evenly")
        .selectAll("div")
        .data(average)
        .enter()
        .append("div")
        .style("display", "flex")
        .style("background", divider)
        .style("height", (([, mark]) => mark * 10 + "%"))
        .style("width", "2rem")
        .append("span")
        .text(toName)
        .style("writing-mode", "vertical-rl")
        .style("display", "flex")
        .style("margin", "-12rem 0 0 0")
        .style("transform", "scale(0.8)")
    })


/*

        element.style {
    writing-mode: vertical-rl;
    background: green;
    height: 65%;
    width: 2rem;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
}
        .style("background", ([, marksArr]) => av(marksArr) < 5 ? "blue" : "green")
        .style("height", ([, marksArr]) => av(marksArr) * 10 + "%")
        .style("width", "1rem")
        .style("padding", "1rem")
        .style("margin", "1rem")
        .style("display", "flex")

        // .style("writing-mode", "vertical-rl")
        .style("display", "flex")
        .style("align-self", "flex-end")
        .style("margin", "0rem 0rem -5rem -1rem")
        .style("z-index", 2)
        .style("width", "1rem")
        .text(([student, marksArr]) => this.mapper.fromStudentToName(this.students[student]) + " " + av(marksArr).toFixed(2));
        */
  }

}
