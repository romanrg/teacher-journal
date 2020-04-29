import {MarksServiceService} from "./marks.service";
import {TestBed} from "@angular/core/testing";
import {HttpClientModule} from "@angular/common/http";
import {Mark} from "../models/IMark";

describe("MarksServiceService", () => {
  /*
  let service: MarksServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarksServiceService);
  });
*/

  let service: MarksServiceService;
  let filteredProperties: [string, string] = ["id", "value"];
  let mockMark: Mark = new Mark("studentId", "subjectId", 10, 101010);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [MarksServiceService]
    });
    service = TestBed.inject(MarksServiceService);
  });

  describe("method getKey", () => {
    it("should return function", () => {
      expect(typeof service.getKey(filteredProperties) === "function").toBe(true);
    });

    it("should execute keyGenerator method once", () => {
      const spy: any = spyOn(service, "keyGenerator");
      service.getKey(filteredProperties)(mockMark);
      expect(spy).toHaveBeenCalled();
    });

    it("should execute keyGenerator method with properties and mark", () => {
      const spy: any = spyOn(service, "keyGenerator");
      service.getKey(filteredProperties)(mockMark);
      expect(spy).toHaveBeenCalledWith(mockMark, filteredProperties);
    });

    it("returned callback should return string", () => {

      const cb: Function = service.getKey(filteredProperties);

      expect(typeof cb(mockMark)  === "string").toBe(true);
    });

  });

  describe("method keyGenerator", () => {
    it("should return string", () => {
      expect(typeof service.keyGenerator(mockMark, filteredProperties) === "string").toBe(true);
    });
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
