import {Directive, ElementRef, HostListener} from "@angular/core";
import {NodeCrawler} from "../helpers/lib";

@Directive({
  selector: "[appHighlight]"
})
export class HighlightDirective {
  public node: NodeCrawler;
  constructor(private el: ElementRef) {
    this.node = new NodeCrawler(this.el.nativeElement);
  }

  private highlight(color: string): void {
    this.node.changeStyle("cursor", "pointer");
    const children: HTMLElement[] = this.node.getChildsArray();
    children.map(cell => (new NodeCrawler(cell)).changeStyle("borderBottom", `solid 0.05rem transparent`));
    if (color) {
      children.map(cell => (new NodeCrawler(cell)).changeStyle("borderBottom", `solid 0.05rem ${color}`));
    } else {
      children.map(cell => (new NodeCrawler(cell)).changeStyle("borderBottom", color));
    }

  }

  @HostListener("mouseenter") public onMouseEnter(): void {
    const children: HTMLElement[] = this.node.getChildsArray();
    const averageValue: string = children[2]?.textContent;
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
