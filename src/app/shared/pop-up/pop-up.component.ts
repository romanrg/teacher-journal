import {
  Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild,
  ViewContainerRef
} from "@angular/core";
import {AdDirective} from "../../common/directives/ad-directive.directive";

@Component({
  selector: "app-pop-up",
  templateUrl: "./pop-up.component.html",
  styleUrls: ["./pop-up.component.sass"]
})
export class PopUpComponent implements OnInit, OnDestroy {

  @Input() public items: [];
  public display: string = "none";
  @Output() public confirmationResult: EventEmitter<boolean> = new EventEmitter();
  @ViewChild(AdDirective, {static: true}) public adHost: AdDirective;
  public componentRef: ComponentRef;


  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
  ) { }

  public ngOnInit(): void {
    this.loadComponent();
  }
  public ngOnDestroy(): void {
  }

  public loadComponent(): void {

    this.display = "flex";

    const factory: ComponentFactory =
      this.componentFactoryResolver.resolveComponentFactory(
        this.items[0].component
      );

    const viewContainerRef: ViewContainerRef = this.adHost.viewContainerRef;
    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(factory);

    (<Component>this.componentRef.instance).data = this.items[0].data;
  }

  public decline = (): false => this.confirmationResult.emit(false);

  public accept = (): true => this.confirmationResult.emit(true);
}
