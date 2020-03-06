import { Component, OnInit } from "@angular/core";
import {SubjectsService} from "../../../common/services/subjects.service";

@Component({
  selector: "app-subjects-list",
  templateUrl: "./subjects-list.component.html",
  styleUrls: ["./subjects-list.component.sass"]
})
export class SubjectsListComponent implements OnInit {

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
