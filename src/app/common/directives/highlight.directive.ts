import {Directive, ElementRef, HostListener} from "@angular/core";

@Directive({
  selector: "[appHighlight]"
})
export class HighlightDirective {

  constructor(private el: ElementRef) {
  }

  private highlight(color: string): void {
    this.el.nativeElement.style.cursor = "pointer";

    if (color) {
      this.el.nativeElement.style.borderBottom = `solid 0.05rem ${color}`;
    } else {
      this.el.nativeElement.style.borderBottom = color;
    }

  }

  @HostListener("mouseenter") public onMouseEnter(): void {
    const averageValue: string = [...this.el.nativeElement.children][2].textContent;
    if (averageValue !== "" && averageValue < 5) {
      this.highlight("blue");
    } else if (averageValue !== "" && averageValue >= 5) {
      this.highlight("green");
    }
  }

  @HostListener("mouseleave") public onMouseLeave(): void {
    this.highlight("");
  }
}
