import {AdItem, AdService} from "./ad.service";

describe("AdService", () => {
  let service: AdService;

  beforeEach(() => {
    service = new AdService();
  });

  it("getConfirmationPop should return array", () => {
      expect(Array.isArray(service.getConfirmationPop("some string")))
        .toBe(true);
  });

  it("getConfirmationPop should return array with one item inside", () => {
    expect(service.getConfirmationPop("some string").length)
      .toBe(1);
  });

  it("getConfirmationPop should return array with AdItem class inside", () => {
    expect(service.getConfirmationPop("some string")[0] instanceof AdItem)
      .toBe(true);
  });

  it("getSuccessPop should return array", () => {
    expect(Array.isArray(service.getSuccessPop({})))
      .toBe(true);
  });

  it("getSuccessPop should return array with one item inside", () => {
    expect(service.getSuccessPop("some string").length)
      .toBe(1);
  });

  it("getSuccessPop should return array with AdItem class inside", () => {
    expect(service.getSuccessPop("some string")[0] instanceof AdItem)
      .toBe(true);
  });

  it("should be created", () => {
    expect(true).toBeTruthy();
  });
});
