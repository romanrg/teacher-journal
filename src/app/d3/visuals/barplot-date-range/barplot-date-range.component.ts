import {Component, Input, OnChanges, OnInit, SimpleChanges} from "@angular/core";
import {D3Service} from "../../d3.service";
import {ISubject} from "../../../common/models/ISubject";

@Component({
  selector: "app-barplot-date-range",
  templateUrl: "./barplot-date-range.component.html",
  styleUrls: ["./barplot-date-range.component.sass"]
})
export class BarplotDateRangeComponent implements OnInit, OnChanges {

  @Input("data") public data: [];
  @Input("renderType") public step: string;

  public colorSchemeDates: {domain: string[]} = this.barPlotService.getColorScheme(10);

  public view: [number, number] = [640, 480];
  public showXAxis: boolean = true;
  public showYAxis: boolean = true;
  public gradient: boolean = false;
  public showLegend: boolean = true;
  public xAxisLabel: boolean = "Marks";
  public showYAxisLabel: boolean = true;
  public yAxisLabel: boolean = "Students";
  public datesInRange: {name: string, series: {name: string, value: string|number}[]}[] = [];

  constructor(
    private barPlotService: D3Service
  ) { }

  public ngOnInit(): void {
    const [subject, marks, dates, students, selected] = this.data;

    const subjects: [ISubject, boolean, boolean][] = subject.filter(tuple => tuple[1]);
    if (subjects.length) {
      this.generateInRangeChart(subjects, marks, dates, students, selected);
    } else {
      this.generateInRangeChart(subject, marks, dates, students, selected);
    }
  }

  public ngOnChanges (changes: SimpleChanges): void {
    if (changes.data !== undefined) {
      this.data = changes.data.currentValue
      const [subject, marks, dates, students, selected] = this.data;
      const subjects: [ISubject, boolean, boolean][] = subject.filter(tuple => tuple[1]);
      if (subjects.length) {
        this.generateInRangeChart(subjects, marks, dates, students, selected);
      } else {
        this.generateInRangeChart(subject, marks, dates, students, selected);
      }
    }

    if (changes.step !== undefined) {
      const [subject, marks, dates, students, selected] = this.data;
      this.step = changes.step.currentValue;
      const subjects: [ISubject, boolean, boolean][] = subject.filter(tuple => tuple[1]);
      if (subjects.length) {
        this.generateInRangeChart(subjects, marks, dates, students, selected);
      } else {
        this.generateInRangeChart(subject, marks, dates, students, selected);
      }
    }



  }

  public generateInRangeChart = (subject, marks, dates, students, selected) => {
    const scale: [number, number] = this.barPlotService.generateDateScale(selected, this.step);
    this.datesInRange = this.barPlotService.generateMarksInScale(scale, this.step, marks, subject);
  }

}
