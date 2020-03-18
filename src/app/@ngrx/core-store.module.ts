import { StoreModule} from "@ngrx/store";
import { NgModule } from "@angular/core";
import { StudentsStoreModule } from "./students/students-store.module";
import { environment } from "../../environments/environment";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
@NgModule({
  imports: [
    StoreModule.forRoot({}, {
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
      }
    }),
    StudentsStoreModule,
    !environment.production ? StoreDevtoolsModule.instrument() : []
  ],
})

export class RootStoreModule {}
