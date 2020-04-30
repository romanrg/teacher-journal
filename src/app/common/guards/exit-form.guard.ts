import { Injectable } from "@angular/core";
import {CanDeactivate} from "@angular/router";
import { Observable } from "rxjs";
export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable({
  providedIn: "root"
})
export class ExitFormGuard implements CanDeactivate<ComponentCanDeactivate> {

  public canDeactivate(component: ComponentCanDeactivate): Observable<boolean> | boolean {
    return component.canDeactivate ? component.canDeactivate() : true;
  }
}
