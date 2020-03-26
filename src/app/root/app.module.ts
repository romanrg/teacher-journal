import { BrowserModule } from "@angular/platform-browser";
import {NgModule} from "@angular/core";
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
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {StudentFormComponent} from "../components/students/student-form/student-form.component";
import {SubjectsTableComponent} from "../components/subjects/subjects-table/subjects-table.component";
import {FormComponent} from "../shared/form/form.component";
import {SubjectFormComponent} from "../components/subjects/subject-form/subject-form.component";
import {DateEditorComponent} from "../shared/date-editor/date-editor.component";
import {SubjectsListComponent} from "../components/subjects/subjects-list/subjects-list.component";
import {BreadcrumbsComponent} from "../shared/breadcrumbs/breadcrumbs.component";
import {ExitFormGuard} from "../common/guards/exit-form.guard";
import {OneHeaderTableComponent} from "../shared/one-header-table/one-header-table.component";
import {TableCaptionComponent} from "../shared/one-header-table/table-caption/table-caption.component";
import {TableHeadComponent} from "../shared/one-header-table/table-head/table-head.component";
import {TableBodyComponent} from "../shared/one-header-table/table-body/table-body.component";
import {TableFootComponent} from "../shared/one-header-table/table-foot/table-foot.component";
import {TableRowComponent} from "../shared/one-header-table/table-row/table-row.component";
import {TableCellComponent} from "../shared/one-header-table/table-cell/table-cell.component";
import {DatePipe, DecimalPipe} from "@angular/common";
import {SortByPipe} from "../common/pipes/sort-by.pipe";
import {HighlightDirective} from "../common/directives/highlight.directive";
import {MarksHighlightDirective} from "../common/directives/marks-highlight.directive";
import {HttpClientModule} from "@angular/common/http";
import {SearchBarComponent} from "../shared/search-bar/search-bar.component";
import {modifyHeadersProvider, queueRequestsProvider, requestQueueProvider} from "../common/interceptors/modify-headers.interceptor";
import {EmptyDataComponent} from "../shared/empty-data/empty-data.component";
import {RootStoreModule} from "../@ngrx/core-store.module";
import {EffectsModule} from "@ngrx/effects";
import {ErrorMessageDisplayComponent} from "../shared/error-message-display/error-message-display.component";
import {LoadingComponent} from "../shared/loading/loading.component";
import {TranslateModule} from "@ngx-translate/core";
import {NgxsModule} from "@ngxs/store";
import {environment} from "../../environments/environment";
import {NgxsStudentsState} from "../@ngxs/students/students.state";

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
    StudentFormComponent,
    SubjectsTableComponent,
    FormComponent,
    SubjectFormComponent,
    DateEditorComponent,
    SubjectsListComponent,
    BreadcrumbsComponent,
    OneHeaderTableComponent,
    TableCaptionComponent,
    TableHeadComponent,
    TableBodyComponent,
    TableFootComponent,
    TableRowComponent,
    TableCellComponent,
    HighlightDirective,
    MarksHighlightDirective,
    SearchBarComponent,
    EmptyDataComponent,
    ErrorMessageDisplayComponent,
    LoadingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RootStoreModule,
    EffectsModule.forRoot([]),
    TranslateModule.forRoot(),
    NgxsModule.forRoot(
      [NgxsStudentsState],
      { developmentMode: !environment.production }
      )
  ],
  providers: [
    ExitFormGuard,
    DecimalPipe,
    SortByPipe,
    DatePipe,
    modifyHeadersProvider,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
