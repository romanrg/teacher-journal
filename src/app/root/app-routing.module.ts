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
import {StudentsTableComponent} from "../components/students/students-table/students-table.component";
import {SubjectsListComponent} from "../components/subjects/subjects-list/subjects-list.component";

const studentsRoutes: Routes = [
  {
    path: "new-student",
    component: StudentFormComponent,
    data : {
      breadcrumb: "add new student"
    }
  },
  {
    path: "",
    component: StudentsTableComponent,
    data : {
      breadcrumb: ""
    }
  },
];

const subjectsRoutes: Routes = [
  {
    path: "new-subject",
    component: SubjectFormComponent,
    data : {
      breadcrumb: "new subject"
    }
  },
  {
    path: "",
    component: SubjectsListComponent,
    pathMatch: "full",
    data : {
      breadcrumb: ""
    }
  },
  {
    path: ":name",
    component: SubjectsTableComponent,
    data : {
      breadcrumb: `subject journal`
    }
  },
];

const routes: Routes = [
  {
    path: "",
    redirectTo: "students",
    pathMatch: "full",
    data : {
      breadcrumb: "home"
    }
  },
  {
    path: "students",
    component: StudentsComponent,
    children: studentsRoutes,
    data : {
      breadcrumb: ""
    }
  },
  {
    path: "subjects",
    component: SubjectsComponent,
    children: subjectsRoutes,
    data : {
      breadcrumb: "subjects"
    }
  },

  {
    path: "statistics",
    component: StatisticsComponent,
    data : {
      breadcrumb: "statistics"
    }
  },
  {
    path: "export",
    component: ExportComponent,
    data : {
      breadcrumb: "export"
    }
  },

  {
    path: "**",
    component: PageNotFoundComponent,
    data : {
      breadcrumb: "404"
    }
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
