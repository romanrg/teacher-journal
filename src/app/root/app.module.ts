import { BrowserModule } from "@angular/platform-browser";
import {NgModule, Renderer2} from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import {StudentsComponent} from "../components/students/students.component";
import {NavigationComponent} from "../components/navigation/navigation.component";
import {SubjectsComponent} from "../components/subjects/subjects.component";
import {StatisticsComponent} from "../components/statistics/statistics.component";
import {ExportComponent} from "../components/export/export.component";
import {PageNotFoundComponent} from "../components/page-not-found/page-not-found.component";
import {StudentsTableComponent} from "../components/students/students-table/students-table.component";
import {ButtonComponent} from "../shared/button/button.component";
import {PaginationComponent} from "../shared/pagination/pagination.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {StudentFormComponent} from "../components/students/student-form/student-form.component";
import {SubjectsTableComponent} from "../components/subjects/subjects-table/subjects-table.component";
import {TableComponent} from "../shared/table/table.component";
import {FormComponent} from "../shared/form/form.component";
import {SubjectFormComponent} from "../components/subjects/subject-form/subject-form.component";
import {DateEditorComponent} from "../shared/date-editor/date-editor.component";
import {SubjectsListComponent} from "../components/subjects/subjects-list/subjects-list.component";


@NgModule({
  declarations: [
    AppComponent,
    StudentsComponent,
    NavigationComponent,
    SubjectsComponent,
    StatisticsComponent,
    ExportComponent,
    PageNotFoundComponent,
    StudentsTableComponent,
    ButtonComponent,
    PaginationComponent,
    StudentFormComponent,
    SubjectsTableComponent,
    TableComponent,
    FormComponent,
    SubjectFormComponent,
    DateEditorComponent,
    SubjectsListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
