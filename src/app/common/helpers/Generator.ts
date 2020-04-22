import {Renderer2} from "@angular/core";
import {FormControlType} from "../models/IFormConfig";
import {ISubject} from "../models/ISubject";
import {DatePipe} from "@angular/common";
import {TranslateService} from "@ngx-translate/core";
import {_allPass, _chain, _compose, _if, NodeCrawler} from "./lib";
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
    this.emptyAttrubutes = {
      type: FormControlType.date,
      name: FormControlType.date
    };
    this.attributes = (min: number, initialValue: string) => ({
      type: FormControlType.date,
      value: initialValue,
      name: FormControlType.date,
      pattern: "[0-9]{4}-[0-9]{2}-[0-9]{2}",
      min
    });
  }

  public shouldAddDateInput(target: EventTarget, headers: string[]): boolean {
    const crawler: NodeCrawler = new NodeCrawler(target);
    const _shouldAdd: Function = _allPass(
      crawler.simpleCheck(({tagName}) => tagName.toLowerCase() === "th"),
      crawler.simpleCheck(({textContent}) => !headers.includes(textContent)),
      crawler.simpleCheck(({textContent}) => textContent.includes(this.selector.add))
    );
    return _shouldAdd(crawler.node);
  }
  public isDeleteDateButton(target: EventTarget): boolean {
    const crawler: NodeCrawler = new NodeCrawler(target);
    const _shouldDelete: Function = _allPass(
      crawler.simpleCheck(({tagName}) => tagName.toLowerCase() === "button"),
      crawler.simpleCheck(({children}) => children[0]?.textContent === this.selector.remove)
    );
    return _shouldDelete(crawler.node);
  }
  public generateDatePicker(
    element: any,
    uniqueDates: ISubject["uniqueDates"],
    pipe: DatePipe,
    onsubmitAction: Function
  ): number[] {
      const [container, initialValue, dateInput, minDate] = _chain(
        () => element.parentNode,
        () => element.textContent,
        this.generateElement.bind(this, "input"),
        () => uniqueDates.sort((a, b) => b - a)[0]
      );

      const transformedMinDate: string = pipe.transform((minDate + this.ONE_DAY_CONSTANT), "yyyy-MM-dd");
      const [form, submitBtn] = _chain(
        this.generateForm.bind(this),
        this.generateSubmitBtn.bind(this),
        this.removeChild.bind(this, container, element),
        _if(
            !uniqueDates.length,
            this.generateAttributes.bind(this, dateInput, this.emptyAttrubutes),
            this.generateAttributes.bind(this, dateInput, this.attributes(transformedMinDate, initialValue))
        )
      );
      _chain(
        this.appendChild.bind(this, container, form),
        this.appendChild.bind(this, form, dateInput),
        this.appendChild.bind(this, form, submitBtn),
      );
      this.renderer.addClass(dateInput, "date-input")
      this.renderer.listen(form, "submit", (e) => {
        e.preventDefault();
        onsubmitAction(e.target[FormControlType.date].value, e.target);
      });
  }
}
export class NumberPicker extends Generator {
  public btnText: string;
  public numberAttributes: any;
  constructor(private renderer: Renderer2, min: number, max: number, translate: TranslateService) {
    super(renderer, translate);
    this.min = min;
    this.max = max;
    this.validation = "^(?:[1-9]|0[1-9]|10)$";
    this.translate?.stream("BUTTON_TYPE").subscribe(data => {
      this.btnText = data.SUBMIT;
    });
    this.numberAttributes = {
      type: FormControlType.number,
      min: this.min,
      max: this.max,
      pattern: this.validation,
      name: FormControlType.number
    };
  }

  public generateNumberPicker = (element: any, onsubmitAction: Function): void  => {

    const container: ParentNode = element.parentNode;

    const [form, submitBtn, numberInput] = _chain(
      this.generateForm.bind(this),
      this.generateSubmitBtn.bind(this),
      this.generateElement.bind(this, "input")
    );

    _chain(
      this.removeChild.bind(this, container, element),
      this.generateAttributes.bind(this, numberInput, this.numberAttributes),
      this.appendChild.bind(this, container, form),
      this.appendChild.bind(this, form, numberInput),
      this.appendChild.bind(this, form, submitBtn)
    );
    this.renderer.addClass(numberInput, "number-input"),
    this.renderer.listen(form, "submit", (e) => {
      e.preventDefault();
      onsubmitAction(e.target[FormControlType.number].value,  [container, form]);
    });
  };

  public shouldAddNumberInput(target: EventTarget, headers: string[], cellIndex: number): boolean {

    const crawler: NodeCrawler = new NodeCrawler(target);

    const _shouldAdd: Function = _allPass(
      crawler.simpleCheck(({tagName}) => tagName.toLowerCase() === "td"),
      cellIndex >= headers.length
    );

    return _shouldAdd(crawler.node);
  }
}


