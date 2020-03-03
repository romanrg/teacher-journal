import { Component, OnInit } from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {StudentsServiceService} from "../../../common/services/students-service.service";
import {Router} from "@angular/router";

@Component({
  selector: "app-student-form",
  templateUrl: "./student-form.component.html",
  styleUrls: ["./student-form.component.sass"]
})
export class StudentFormComponent implements OnInit {

  public form: FormGroup = new FormGroup({
    name: new FormControl("", [Validators.required]),
    surname: new FormControl("", [Validators.required]),
    adress: new FormControl(""),
    description: new FormControl("")
  });
  constructor(
    private studentsService: StudentsServiceService,
    private router: Router
  ) { }

  public ngOnInit(): void {
  }

  public onSubmit(): void {
    this.studentsService.addStudent(this.form.value);
    this.router.navigate(["/students"]);
  }

  get name(){
    return this.form.get("name");
  }

  get surname() {
    return this.form.get("surname");
  }
}
