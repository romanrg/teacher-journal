import {Component, Input, OnChanges, OnInit, SimpleChanges} from "@angular/core";
import {ISubject} from "../../../common/models/ISubject";
import {IStudent} from "../../../common/models/IStudent";
import {D3Service} from "../../d3.service";
import {_compose, _if} from "../../../common/helpers/lib";
import {Mark} from "../../../common/models/IMark";
import {NgxChartsModule} from "@swimlane/ngx-charts";

@Component({
  selector: "app-barplot",
  templateUrl: "./barplot.component.html",
  styleUrls: ["./barplot.component.sass"],
})
export class BarplotComponent implements OnInit, OnChanges {

  @Input("data") public data: [any, any, any, any, any];
  @Input("index") public index: number;
  public colorSchemeDates: {domain: string[]} = {domain: []};
  public colorSchemePerformance: {domain: string[]} = {domain: []};
  public marks: any;

  public view: [number, number] = [640, 480];
  public showXAxis: boolean = true;
  public showYAxis: boolean = true;
  public gradient: boolean = false;
  public showLegend: boolean = false;
  public showXAxisLabel: boolean = true;
  public xAxisLabel: string = "Marks";
  public showYAxisLabel: boolean = true;
  public yAxisLabel: string = "Students";

  public byDates: any[] = [];
  public heatMap: any[] = [];
  public xAxisLabelByDates: string = "Dates";
  public yAxisLabelByDates: string = "Students";

  public byPerformance: any[] = [];

  constructor(
    private barPlotService: D3Service
  ) { }

  public createByDates = (
    subject: [ISubject],
    marks: {[prop: string]: Mark[]},
    dates: {[prop: string]: [number, boolean, boolean]},
    students: {[prop: string]: IStudent},
    selected: number[]
    ): void => {
    const subjId: string = subject[0].id;
    const datesObject: {name: string, series: any[]}[] = this.barPlotService.getDatesObject(
      students, marks, selected, subjId
    );
    this.heatMap = [...datesObject].sort((
      a: {name: string, series: any[]},
      b: {name: string, series: any[]}
      ) => b.series.length - a.series.length);
    this.byDates = this.barPlotService.applyTendencies(datesObject);

  };

  public createAverageBars = (
    subject: [ISubject],
    marks: {[prop: string]: Mark[]},
    dates: {[prop: string]: [number, boolean, boolean]},
    students: {[prop: string]: IStudent}
    ): void => {

    this.marks = _compose(
      this.barPlotService.getDataForBarFromEntries,
      this.barPlotService.sortEntries,
      this.barPlotService.getEntries,
      this.barPlotService.getAverageMarksObject
    )(marks, subject[0].id, students);

    this.byPerformance = this.barPlotService.getPerformanceData(
      this.marks, Object.keys(students).length
    );

    this.colorSchemeDates = _if(
      !this.colorSchemeDates.domain.length,
      this.barPlotService.getColorScheme(this.marks.length),
      this.colorSchemeDates
    );

    this.colorSchemePerformance = _if(
      !this.colorSchemePerformance.domain.length,
      this.barPlotService.getColorScheme(5),
      this.colorSchemePerformance
    );

  }

  public ngOnInit (): void {
    const [subject, marks, dates, students, selected] = this.data;
    this.createAverageBars(subject, marks, dates, students);
    this.createByDates(subject, marks, dates, students, selected);
  }

  public ngOnChanges (changes: SimpleChanges): void {
    const [subject, marks, dates, students, selected] = changes.data.currentValue;
    this.createAverageBars(subject, marks, dates, students);
    this.createByDates(subject, marks, dates, students, selected);

  }

}
