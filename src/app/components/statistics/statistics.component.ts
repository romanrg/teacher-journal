import { Component, OnInit } from "@angular/core";
import {ITableConfig} from "../../common/models/ITableConfig";
import {StudentsServiceService} from "../../common/services/students-service.service";
import {IStudent} from "../../common/models/IStudent";
import {Observable} from "rxjs";


@Component({
  selector: "app-statistics",
  templateUrl: "./statistics.component.html",
  styleUrls: ["./statistics.component.sass"],
})
export class StatisticsComponent implements OnInit {

  constructor(

  ) { }

  public ngOnInit(): void {

  }

}
