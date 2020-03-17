import { StoreModule} from "@ngrx/store";
import { NgModule } from "@angular/core";
import { StudentsStoreModule } from "./students/students-store.module";

@NgModule({
  imports: [
    StoreModule.forRoot({}, {
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
      }
    }),
    StudentsStoreModule
  ],
})

export class RootStoreModule {}
