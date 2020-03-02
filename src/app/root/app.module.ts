import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import {StudentsComponent} from "../components/students/students.component";
import {NavigationComponent} from "../components/navigation/navigation.component";
import {SubjectsComponent} from "../components/subjects/subjects.component";
import {StatisticsComponent} from "../components/statistics/statistics.component";
import {ExportComponent} from "../components/export/export.component";
import {PageNotFoundComponent} from "../components/page-not-found/page-not-found.component";

@NgModule({
  declarations: [
    AppComponent,
    StudentsComponent,
    NavigationComponent,
    SubjectsComponent,
    StatisticsComponent,
    ExportComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
