import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { StoreModule } from "@ngrx/store";
import { studentsReducer } from "./students.reducer";
import { EffectsModule } from '@ngrx/effects';
import { StudentsEffects } from './students.effects';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature("students", studentsReducer),
    EffectsModule.forFeature([StudentsEffects])
  ]
})
export class StudentsStoreModule { }
