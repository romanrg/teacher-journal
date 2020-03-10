import {AfterContentInit, Directive, ElementRef, OnInit} from "@angular/core";

@Directive({
  selector: "[appMarksHighlight]"
})
export class MarksHighlightDirective implements OnInit, AfterContentInit {

  constructor(private el: ElementRef) { }
  public ngOnInit(): void {
    // console.log(this.el.nativeElement.textContent);

  }

  public ngAfterContentInit(): void {
    const mark =  this.el.nativeElement.parentNode.textContent;
    if (mark !== "") {
      if (mark >= 5) {
        this.el.nativeElement.parentNode.style.color = "#04572e";
      } else if (mark < 5) {
        this.el.nativeElement.parentNode.style.color = "#0e314e";
      }
    }

  }

}
