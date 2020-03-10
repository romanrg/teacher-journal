import {Renderer2} from "@angular/core";

export class Generator {
  constructor(private render: Renderer2) {
    this.render = render;
  }

  public generateElement(tagName: string): any {
    return this.render.createElement(tagName);
  }

  public generateAttributes(element: EventTarget, attributes): void {
    Object.keys(attributes).forEach(attr => {
      this.render.setAttribute(element, attr, attributes[attr]);
    });

  }

  public generateProperties(element: EventTarget, properties): void {
    Object.keys(properties).forEach(prop => {
      this.render.setProperty(element, prop, properties[prop]);
    });
  }

  public appendChild(parent: any, child: any): void {
    this.render.appendChild(parent, child);
  }

  public createText(element: EventTarget, text: string): void {
    this.render.appendChild(element, this.render.createText(text));
  }

  public removeChild(parent: any, child: any): void {
    this.render.removeChild(parent, child);
  }

}
