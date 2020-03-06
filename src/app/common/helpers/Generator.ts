import {Renderer2} from "@angular/core";

export class Generator {
  constructor(private render: Renderer2) {
    this.render = render;
  }

  public generateElement(tagName: string): any {
    return this.render.createElement("input");
  }

  public generateAttributes(element: any, attributes): void {
    for (let attr in attributes) {
      if (attributes.hasOwnProperty(attr)) {
        this.render.setAttribute(element, attr, attributes[attr]);
      }
    }
  }

  public generateProperties(element: any, properties): void {
    for (let prop in properties) {
      if (properties.hasOwnProperty(prop)) {
        this.render.setProperty(element, prop, properties[prop]);
      }
    }
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

}
