import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import {StudentsComponent} from "../components/students/students.component";
import {SubjectsComponent} from "../components/subjects/subjects.component";
import {StatisticsComponent} from "../components/statistics/statistics.component";
import {ExportComponent} from "../components/export/export.component";
import {PageNotFoundComponent} from "../components/page-not-found/page-not-found.component";
import {StudentFormComponent} from "../components/students/student-form/student-form.component";
import {SubjectsTableComponent} from "../components/subjects/subjects-table/subjects-table.component";
import {SubjectFormComponent} from "../components/subjects/subject-form/subject-form.component";

const routes: Routes = [
  {path: "", redirectTo: "students", pathMatch: "full"},
  {path: "students", component: StudentsComponent},
  {path: "subjects", component: SubjectsComponent},
  {path: "subjects/:id",  component: SubjectsTableComponent},
  {path: "new-subject", component: SubjectFormComponent},
  {path: "statistics", component: StatisticsComponent},
  {path: "export", component: ExportComponent},
  {path: "new-student", component: StudentFormComponent},
  {path: "**", component: PageNotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
