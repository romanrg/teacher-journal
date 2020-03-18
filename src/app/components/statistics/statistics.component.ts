import { Component, OnInit } from "@angular/core";
import {SubjectsService} from "../../common/services/subjects.service";
import {StudentsServiceService} from "../../common/services/students-service.service";


@Component({
  selector: "app-statistics",
  templateUrl: "./statistics.component.html",
  styleUrls: ["./statistics.component.sass"],
})
export class StatisticsComponent implements OnInit {

  constructor(
    private studentsService: StudentsServiceService,
    public subjectService: SubjectsService,
  ) { }

  public ngOnInit(): void {
  }

}
