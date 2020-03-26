import { StoreModule} from "@ngrx/store";
import { NgModule } from "@angular/core";
import { StudentsStoreModule } from "./students/students-store.module";
import { environment } from "../../environments/environment";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import {SubjectsStoreModule} from "./subjects/subjects-store.module";
import {MarksStoreModule} from "./marks/marks-store.module";
@NgModule({
  imports: [
    StoreModule.forRoot({}, {
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
      }
    }),
    StudentsStoreModule,
    SubjectsStoreModule,
    MarksStoreModule,
    /*
    !environment.production ? StoreDevtoolsModule.instrument() : []
    */
  ],
})

export class RootStoreModule {}
