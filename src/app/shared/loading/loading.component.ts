import { Component} from "@angular/core";

@Component({
  selector: "app-loading",
  templateUrl: "./loading.component.html",
  styleUrls: ["./loading.component.sass"]
})
export class LoadingComponent {
  public getMessage: Function = (): string => navigator.language === "en-US" ? "Loading" : "Загрузка";
}
