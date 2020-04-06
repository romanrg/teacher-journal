import { Component, OnInit } from "@angular/core";



//ngxs
import * as Ngxs from "@ngxs/store";
import {SubjectTableState} from "../../../@ngxs/subjects/subjects.state";
import {Subjects} from "../../../@ngxs/subjects/subjects.actions";
import {Marks} from "../../../@ngxs/marks/marks.actions";
import {Observable} from "rxjs";
import {ISubject} from "../../common/models/ISubject";
import {__filter, _chain, _compose, _if, _partial, _pluck, _take, NodeCrawler} from "../../common/helpers/lib";
import {IStudent} from "../../common/models/IStudent";
import {Mark} from "../../common/models/IMark";
@Component({
  selector: "app-statistics",
  templateUrl: "./statistics.component.html",
  styleUrls: ["./statistics.component.sass"],
})
export class StatisticsComponent implements OnInit {

  public isVisibleDropdown: boolean = false;
  public state$: Observable<SubjectTableState>;
  public subjects: Observable<ISubject[]>;
  public students: Observable<IStudent[]>;
  public marks: Observable<Mark[]>;
  constructor(
    private store: Ngxs.Store
  ) {
    this.state$ = this.store.select(state => _chain(
      () => _compose(_partial(_pluck, "data"), _partial(_pluck, "subjects"))(state),
      () => _compose(_partial(_pluck, "data"), _partial(_pluck, "students"))(state),
      () => _compose(_partial(_pluck, "data"), _partial(_pluck, "marks"))(state)
    ));
  }

  public ngOnInit(): void {
    this.state$.subscribe(([subjects, students, marks]) => {

        this.subjects = __filter(({uniqueDates}) => uniqueDates.length > 0)(subjects);

        this.marks =  this.subjects.reduce((acc, subj) => {
          acc[subj.id] = __filter(({subject}) => subj.id === subject)(marks);
          return acc;
        }, {});

        this.students = students;

    });
  }

  public toggleDropdown(): void {
    this.isVisibleDropdown = !this.isVisibleDropdown;
  }

  public getOnlyUniqueDates = (marks: Mark[]) => Array.from(new Set(marks.map(mark => _pluck("time", mark))));

  public expandItem(target: EventTarget): void {
    const crawler: NodeCrawler = new NodeCrawler(target);
    const expandTarget: HTMLElement = crawler.getChildsArray()[0];
    console.log(expandTarget.style.display = "flex");

  }
}
