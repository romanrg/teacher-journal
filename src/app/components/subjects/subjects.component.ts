import { Component, OnInit } from "@angular/core";
import {SubjectsService} from "../../common/services/subjects.service";

@Component({
  selector: "app-subjects",
  templateUrl: "./subjects.component.html",
  styleUrls: ["./subjects.component.sass"]
})
export class SubjectsComponent implements OnInit {

  constructor(
    private subjectService: SubjectsService
  ) { }

  public ngOnInit(): void {
  }

}
