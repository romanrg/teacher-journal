import {Injectable, Type} from "@angular/core";
import {SuccessUpComponent} from "../../shared/success-up/success-up.component";
import {ErrorUpComponent} from "../../shared/error-up/error-up.component";


export class AdItem {
  constructor(public component: Type<any>, public data: any) {}
}


@Injectable({
  providedIn: 'root'
})
export class AdService {

  public getPopUps(): any {
    return [
      new AdItem(SuccessUpComponent, "Wow So Successfull!"),
      new AdItem(ErrorUpComponent, "Such an error!")
    ];
  }

  public getSuccessPop(successMessage: string): [] {
    return [
      new AdItem(SuccessUpComponent, successMessage)
    ];
  }

  public getErrorPop(errorMessage: string): [] {
    return [
      new AdItem(ErrorUpComponent, errorMessage)
    ];
  }
}
