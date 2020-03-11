import {Renderer2} from "@angular/core";
import {FormControlType} from "../models/IFormConfig";
import {ISubject} from "../models/ISubject";
import {DatePipe} from "@angular/common";

export class Generator {
  constructor(private render: Renderer2) {
    this.render = render;
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

}

export class DatePicker extends Generator {
  constructor(private renderer: Renderer2) {
    super(renderer);
    this.ONE_DAY_CONSTANT = 1000 * 24 * 60 * 60;
  }

  public generateDatePicker(
    element: any,
    uniqueDates: ISubject["uniqueDates"],
    pipe: DatePipe,
  ): number[] {
      const inputContainer: ParentNode = element.parentNode;
      const initialValue: string = element.textContent;
      this.removeChild(inputContainer, element);
      const dateInput: any = this.generateElement("input");
      this.renderer.addClass(dateInput, "date-input");
      if (!uniqueDates.length) {
        this.generateAttributes(dateInput, {
          type: FormControlType.date,
          value: initialValue
        });
      } else {
        const minDate: number = (uniqueDates.sort((a, b) => b - a)[0]);
        this.generateAttributes(dateInput, {
          type: FormControlType.date,
          value: initialValue,
          min: pipe.transform((minDate + this.ONE_DAY_CONSTANT), "yyyy-MM-dd")
        });
      }
      this.appendChild(inputContainer, dateInput);
  }
}

export class NumberPicker extends Generator {
  constructor(private renderer: Renderer2, min: number, max: number) {
    super(renderer);
    this.min = min;
    this.max = max;
  }

  public generateNumberPicker(element: any): void {
    const inputContainer: ParentNode = element.parentNode;
    this.removeChild(inputContainer, element);
    const numberInput: any = this.generateElement("input");
    this.renderer.addClass(numberInput, "number-input");
    this.generateAttributes(numberInput, {
      type: FormControlType.number,
      min: this.min,
      max: this.max
    });
    this.appendChild(inputContainer, numberInput);
  }
}
