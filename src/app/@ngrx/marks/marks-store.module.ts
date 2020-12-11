import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { StoreModule } from "@ngrx/store";
import {marksReducer} from "./marks.reducer";
import { EffectsModule } from '@ngrx/effects';
import {MarksEffects} from "./marks.effects";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature("marks", marksReducer),
    EffectsModule.forFeature([MarksEffects])
  ]
})
export class MarksStoreModule { }
