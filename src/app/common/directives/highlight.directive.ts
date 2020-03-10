import {Directive, ElementRef, HostListener} from "@angular/core";

@Directive({
  selector: "[appHighlight]"
})
export class HighlightDirective {

  constructor(private el: ElementRef) { }

  @HostListener("mouseenter") public onMouseEnter() {
    const averageValue: string = [...this.el.nativeElement.children][2].textContent;
    if (averageValue !== "" && averageValue < 5) {
      this.highlight("blue");
    } else if (averageValue !== "" && averageValue >= 5){
      this.highlight("green");
    }
  }

  @HostListener("mouseleave") public onMouseLeave() {
    this.highlight(null);
  }

  private highlight(color: string): void {
    this.el.nativeElement.style.backgroundColor = color;
  }
}
