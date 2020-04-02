import { Injectable } from '@angular/core';
import {MissingTranslationHandler, MissingTranslationHandlerParams} from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class MissingTranslationService implements MissingTranslationHandler {
  public handle(params: MissingTranslationHandlerParams): string {
    return `${params.key} is missing in ${params.translateService.currentLang}`;
  }
}
