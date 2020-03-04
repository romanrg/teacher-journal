import { Component, OnInit } from "@angular/core";
import {SubjectsService} from "../../common/services/subjects.service";
import {Router} from "@angular/router";

@Component({
  selector: "app-subjects",
  templateUrl: "./subjects.component.html",
  styleUrls: ["./subjects.component.sass"]
})
export class SubjectsComponent implements OnInit {

  constructor(
    public subjectService: SubjectsService,
    // public route: Router
  ) { }

  public ngOnInit(): void {
  }

  public addNewSubject(): void {
    // this.route.navigate("/new-subject");
  }
}
