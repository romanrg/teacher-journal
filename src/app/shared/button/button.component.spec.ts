import {async, ComponentFixture, ComponentFixtureAutoDetect, TestBed} from "@angular/core/testing";

import { ButtonComponent } from "./button.component";
import {DebugElement} from "@angular/core";
import {By} from "@angular/platform-browser";

describe("ButtonComponent", () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  const passedData: any = {
    screenReader: "Screenreader mockup message",
    textContent: "Textcontant mockup message",
    action: () => "clicked",
    isDisabled: false,
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    component.textContent = passedData.textContent;
    component.screenReaderMessage = passedData.screenReader;
    component.action = passedData.action;
    component.isDisabled = passedData.isDisabled;
    fixture.detectChanges();
    de = fixture.debugElement.query(By.css(".visually-hidden"));
    el = de.nativeNode;
  });


  it("should create component instance", () => {
    expect(component).toBeDefined();
  });

  it("should trigger passed action when clicked", (done: DoneFn) => {
    const button: ButtonComponent = new ButtonComponent();
    button.emitter.subscribe((event: any) => {
      expect(event).toBeUndefined();
      done();
    });
    button.onActionTriggered();
  });

  it("should show message for screen reader", () => {
    expect(el.textContent).toBe("Screenreader mockup message");
  });

  it("should change message for screen reader when input changes", () => {
    expect(el.textContent).toBe("Screenreader mockup message");
    component.screenReaderMessage = "new message";
    fixture.detectChanges();
    expect(el.textContent).toBe("new message");
  });

});
