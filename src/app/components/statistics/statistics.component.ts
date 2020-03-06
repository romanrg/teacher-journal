import { Component, OnInit } from "@angular/core";
import {IFormConfig} from "../../common/models/IFormConfig";
import {Validators} from "@angular/forms";

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

  DoSmt($event) {
    console.log($event);
  }
}
