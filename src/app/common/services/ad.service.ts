import {Injectable, Type} from "@angular/core";
import {SuccessUpComponent} from "../../shared/success-up/success-up.component";
import {ErrorUpComponent} from "../../shared/error-up/error-up.component";
import {ConfirmationPopUpComponent} from "../../shared/confirmation-pop-up/confirmation-pop-up.component";

export class AdItem {
  constructor(public component: Type<any>, public data: any) {}
}

@Injectable({
  providedIn: "root"
})
export class AdService {

  public getSuccessPop(popObject: {}): [AdItem] {
    return [
      new AdItem(SuccessUpComponent, popObject)
    ];
  }

  public getConfirmationPop(confirmation?: string): [AdItem] {
    return [
      new AdItem(ConfirmationPopUpComponent, confirmation)
    ];
  }

  public getErrorPop(errorMessage: string): [AdItem] {
    return [
      new AdItem(ErrorUpComponent, errorMessage)
    ];
  }
}
