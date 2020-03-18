import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { StoreModule } from "@ngrx/store";
import { subjectsReducer } from "./subjects.reducer";
import { EffectsModule } from "@ngrx/effects";
import {SubjectsEffects} from "./subjects.effects";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature("subjects", subjectsReducer),
    EffectsModule.forFeature([SubjectsEffects])
  ]
})
export class SubjectsStoreModule { }
