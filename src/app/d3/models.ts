export class Barplot {
  constructor() {}
}

/*
      d3.select(".chart")
        .style("height", "100%")
        .style("width", "100%")
        .style("display", "flex")
        .style("align-items", "flex-end")
        // .style("flex-direction", "column")
        .selectAll("div")
        .data(data)
        .enter()
        .append("div")
        .style("background", ([, marksArr]) => av(marksArr) < 5 ? "blue" : "green")
        .style("height", ([, marksArr]) => av(marksArr) * 10 + "%")
        .style("width", "1rem")
        .style("padding", "1rem")
        .style("margin", "1rem")
        .style("display", "flex")
        .append("span")
        // .style("writing-mode", "vertical-rl")
        .style("display", "flex")
        .style("align-self", "flex-end")
        .style("margin", "0rem 0rem -5rem -1rem")
        .style("z-index", 2)
        .style("width", "1rem")
        .text(([student, marksArr]) => this.mapper.fromStudentToName(this.students[student]) + " " + av(marksArr).toFixed(2));
 */

/*
        d3.select(".chart").selectAll("div").remove();

 */
