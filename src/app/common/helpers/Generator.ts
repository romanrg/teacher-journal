import {Renderer2} from "@angular/core";
import {FormControlType} from "../models/IFormConfig";
import {ISubject} from "../models/ISubject";
import {DatePipe} from "@angular/common";
import {TranslateService} from "@ngx-translate/core";
export class Generator {
  public btnText: string;
  constructor(
    private render: Renderer2,
    private translate: TranslateService
  ) {
    this.render = render;
    this.translate = translate;

  }

  public generateElement(tagName: string): any {
    return this.render.createElement(tagName);
  }

  public generateAttributes(element: any, attributes): void {
    Object.keys(attributes).forEach(attr => {
      this.render.setAttribute(element, attr, attributes[attr]);
    });

  }

  public generateProperties(element: any, properties): void {
    Object.keys(properties).forEach(prop => {
      this.render.setProperty(element, prop, properties[prop]);
    });
  }

  public appendChild(parent: any, child: any): void {
    this.render.appendChild(parent, child);
  }

  public createText(element: any, text: string): void {
    this.render.appendChild(element, this.render.createText(text));
  }

  public removeChild(parent: any, child: any): void {
    this.render.removeChild(parent, child);
  }

  public listenEvent(element: any, eventName: string, cb: (event: any) => boolean | void): void {
    return this.render.listen(element, eventName, cb);
  }

  public generateForm(): any {
    const form: any = this.generateElement("form");
    this.renderer.addClass(form, "generated-form");
    return form;
  }

  public generateSubmitBtn(): any {
    const submitBtn: any = this.generateElement("button");
    this.generateAttributes(submitBtn, {type: "submit"});
    this.appendChild(submitBtn, this.renderer.createText(this.btnText));
    this.renderer.addClass(submitBtn, "generated-submit");
    return submitBtn;
  }

}
export class DatePicker extends Generator {
  public selector: {};
  public btnText: string;
  constructor(
    private renderer: Renderer2,
    private translate: TranslateService
  ) {
    super(renderer);
    this.ONE_DAY_CONSTANT = 1000 * 24 * 60 * 60;
    this.translate.stream("FORMS").subscribe(data => {
      this.selector = {add: data.DATE_GENERATOR.SELECTOR_ADD, remove: data.DATE_GENERATOR.SELECTOR_DELETE};
    });
    this.translate?.stream("BUTTON_TYPE").subscribe(data => {
      this.btnText = data.SUBMIT;
    });
  }

  public shouldAddDateInput(target: EventTarget, headers: string[]): boolean {
    return (
      target.tagName.toLowerCase() === "th" &&
      !headers.includes(target.textContent) &&
      target.textContent.includes(this.selector.add)
    );
  }
  public isDeleteDateButton(target: EventTarget): boolean {
    return (target.tagName.toLowerCase() === "button" && target.children[0]?.textContent === this.selector.remove);
  }
  public generateDatePicker(
    element: any,
    uniqueDates: ISubject["uniqueDates"],
    pipe: DatePipe,
    onsubmitAction: Function
  ): number[] {

      const container: ParentNode = element.parentNode;
      const initialValue: string = element.textContent;
      this.removeChild(container, element);
      const dateInput: any = this.generateElement("input");
      this.renderer.addClass(dateInput, "date-input");
      if (!uniqueDates.length) {
        this.generateAttributes(dateInput, {
          type: FormControlType.date,
          name: FormControlType.date
        });
      } else {
        const minDate: number = (uniqueDates.sort((a, b) => b - a)[0]);
        this.generateAttributes(dateInput, {
          type: FormControlType.date,
          value: initialValue,
          name: FormControlType.date,
          pattern: "[0-9]{4}-[0-9]{2}-[0-9]{2}",
          min: pipe.transform((minDate + this.ONE_DAY_CONSTANT), "yyyy-MM-dd")
        });
      }
      const form: any = this.generateForm();
      const submitBtn: any = this.generateSubmitBtn();

      this.appendChild(container, form);
      this.appendChild(form, dateInput);
      this.appendChild(form, submitBtn);
    const unlistener = this.renderer.listen(form, "submit", (e) => {
        e.preventDefault();
        onsubmitAction(e.target[FormControlType.date].value, e.target);
      });
    return {unlistener, target: form, type: "submit"};
  }
}
export class NumberPicker extends Generator {
  public btnText: string;
  constructor(private renderer: Renderer2, min: number, max: number, translate: TranslateService) {
    super(renderer, translate);
    this.min = min;
    this.max = max;
    this.validation = "^(?:[1-9]|0[1-9]|10)$";
    this.translate?.stream("BUTTON_TYPE").subscribe(data => {
      this.btnText = data.SUBMIT;
    });
  }

  public generateNumberPicker(element: any, onsubmitAction: Function): void {
    const container: ParentNode = element.parentNode;
    this.removeChild(container, element);
    const form: any = this.generateForm();
    const submitBtn: any = this.generateSubmitBtn();
    const numberInput: any = this.generateElement("input");
    this.renderer.addClass(numberInput, "number-input");
    this.generateAttributes(numberInput, {
      type: FormControlType.number,
      min: this.min,
      max: this.max,
      pattern: this.validation,
      name: FormControlType.number
    });
    this.appendChild(container, form);
    this.appendChild(form, numberInput);
    this.appendChild(form, submitBtn);
    const unlistener = this.renderer.listen(form, "submit", (e) => {
      e.preventDefault();
      onsubmitAction(e.target[FormControlType.number].value,  [container, form]);
    });
    return {unlistener, target: form, type: "submit"};
  }

  public shouldAddNumberInput(target: EventTarget, headers: string[], cellIndex: number): boolean {
    return (target.tagName.toLowerCase() === "td" && cellIndex >= headers.length);
  }
}


