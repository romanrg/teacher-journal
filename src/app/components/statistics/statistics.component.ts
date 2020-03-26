import { Component, OnInit } from "@angular/core";

//ngxs
import * as Ngxs from "@ngxs/store";
import * as StudentsActions from "../../@ngxs/students/students.actions";
import {Observable} from "rxjs";
import {IStudent, StudentModel} from "../../common/models/IStudent";
import {Select} from "@ngxs/store";
import {NgxsStudentsState} from "../../@ngxs/students/students.state";


const students = [
  {
    "id": "5e6a314dda8563cb9fd7db3f",
    "name": "Keith",
    "surname": "Kirkland",
    "address": "Cook Islands, Nile, Lacon Court 171",
    "description": "Reprehenderit adipisicing reprehenderit deserunt proident in sint sint exercitation dolor ea ipsum nisi."
  },
  {
    "id": "5e6a314d96ae92c3115c9d20",
    "name": "Suzette",
    "surname": "Strong",
    "address": "Chile, Bedias, Berry Street 89",
    "description": "Adipisicing est ad in ad ex sint pariatur nostrud cupidatat."
  },
  {
    "id": "5e6a314d44a6f4b0ee4e4f68",
    "name": "Debbie",
    "surname": "George",
    "address": "Taiwan, Thynedale, Livonia Avenue 53",
    "description": "Exercitation amet ipsum consequat ut ad sint id fugiat reprehenderit."
  }
]

function log(target: Function, key: string, value: any) {
  return {
    value: function (...args: any[]): any {
      const a: string = args.map(arg => JSON.stringify(arg)).join();
      const result: any = value.value.apply(this, args);
      console.log(`Call: ${key}(${a}) => ${JSON.stringify(result)}`);
      return result;
    }
  };
}

@Component({
  selector: "app-statistics",
  templateUrl: "./statistics.component.html",
  styleUrls: ["./statistics.component.sass"],
})
export class StatisticsComponent implements OnInit {

  @Select(NgxsStudentsState.Students) public students$: Observable<IStudent[]>;

  constructor(
    private ngxsStore: Ngxs.Store
  ) {}

  public ngOnInit(): void {
  }

  public handleClick($event: Event): void {
    // this.ngxsStore.dispatch(new GetStudents([students]));
    this.ngxsStore.dispatch(new StudentsActions.Students.ChangePagination(50));
    this.ngxsStore.dispatch(new StudentsActions.Students.Get());
  }

  public handleDelete(id: string): void {
    this.ngxsStore.dispatch(new StudentsActions.Students.Delete(id));
  }

  public addNew(): void {
    const newStudent = new StudentModel(
      "Vlad", "Sapagou", "Zhukova 29", "Hard Worker"
    );
    this.ngxsStore.dispatch(new StudentsActions.Students.Create(newStudent));
  }

  sea($event: Event) {
    const search = $event.target.value
    this.ngxsStore.dispatch(new StudentsActions.Students.Search(search));
  }
}
