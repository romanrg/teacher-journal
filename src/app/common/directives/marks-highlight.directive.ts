import {AfterContentInit, Directive, ElementRef, OnInit} from "@angular/core";

@Directive({
  selector: "[appMarksHighlight]"
})
export class MarksHighlightDirective implements OnInit, AfterContentInit {

  constructor(private el: ElementRef) { }
  public ngOnInit(): void {
  }

  public ngAfterContentInit(): void {
    const cellIndex: number = +this.el.nativeElement.parentNode.parentNode.getAttribute("index");
    const mark: string =  this.el.nativeElement.parentNode.textContent;

    if (cellIndex > 2 && mark !== "") {
      if (+mark >= 5) {
        this.el.nativeElement.parentNode.style.color = "green";
      } else if (+mark < 5) {
        this.el.nativeElement.parentNode.style.color = "blue";
      }
    }

  }

}
