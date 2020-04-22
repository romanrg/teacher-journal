import {
  Component, ComponentFactoryResolver, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges,
  ViewChild
} from "@angular/core";
import {AdDirective} from "../../common/directives/ad-directive.directive";

@Component({
  selector: "app-pop-up-action",
  templateUrl: "./pop-up-action.component.html",
  styleUrls: ["./pop-up-action.component.sass"]
})
export class PopUpActionComponent implements OnInit, OnDestroy, OnChanges {

  @Input() public data: [];
  public display: string = "none";
  @Output() public close: EventEmitter<boolean> = new EventEmitter();
  @ViewChild(AdDirective, {static: true}) public adHost: AdDirective;
  public componentRef: ComponentRef;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
  ) {
  }

  public ngOnInit(): void {
    this.render(this.data);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.data = changes.data.currentValue;
    this.render(this.data);
  }
  public ngOnDestroy(): void {
  }

  public render(data: []): void {
    const factory: ComponentFactory =
      this.componentFactoryResolver.resolveComponentFactory(
        data[0].component
      );

    const viewContainerRef: ViewContainerRef = this.adHost.viewContainerRef;
    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(factory);

    (<Component>this.componentRef.instance).data = data[0].data;
  }

  public closeUp = (): void => this.close.emit(true);
}
