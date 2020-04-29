import {MarksServiceService} from "./marks.service";
import {TestBed} from "@angular/core/testing";
import {HttpClientModule} from "@angular/common/http";
import {Mark} from "../models/IMark";
import {Observable} from "rxjs";

describe("MarksServiceService", () => {
  let service: MarksServiceService;
  let filteredProperties: [string, string] = ["id", "value"];
  let mockMark: Mark = new Mark("studentId", "subjectId", 10, 101010);
  let mockMark1: Mark = new Mark("studentId1", "subjectId1", 101, 1010101);
  let mockMark2: Mark = new Mark("studentId2", "subjectId2", 102, 1010102);
  const mocked: Mark[] = [mockMark, mockMark1, mockMark2];


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

  describe("submitMark", () => {
    /*
    let result: Observable<Mark[]>;
    beforeEach(() => {
      result = service.getMarks();
    });
    it("should return Observable", () => {

    })
    */
  });

  describe("getMarks", () => {

    let result: Observable<Mark[]>;

    beforeEach(() => {
      result = service.getMarks();
    });

    it("should return Observable", () => {
      expect(result instanceof Observable).toBe(true);
    });

    it("returned Observable should consist of array", (done: DoneFn) => {
      result.subscribe(marks => {
        expect(Array.isArray(marks)).toBe(true);
        done();
      });
    });

    it("returned Observable should consist of marks array", (done: DoneFn) => {
      result.subscribe(marks => {
        marks.forEach(mark =>
          expect(Object.keys(mark).sort()).toEqual(["student", "subject", "time", "value", "_id", "_deletedAt" , "__v"].sort())
        );
        done();
      });
    });
  });

  describe("patchMark", () => {
  });

  describe("getMemory", () => {
    it("should return object", () => {
      const memory: {[prop: string]: Mark} = service.getMemory();
      expect(memory !== null && typeof memory === "object").toBe(true);
    });
    it("should consist of marks", () => {
      mocked.map(mark => service.addHash(mark));
      const result: Mark[] = Object.values(service.getMemory());
      mocked.map(mark => expect(result).toContain(mark));
    });
  });

  describe("clearMemory", () => {
    it("should clear memory", () => {
      mocked.map(mark => service.addHash(mark));
      service.clearMemory();
      expect(Object.keys(service.getMemory()).length).toEqual(0);
    });
  });

  describe("deleteMarks", () => {
  });

  describe("addHash", () => {
    it("should add mark to the container", () => {
      service.addHash(mockMark);
      expect(service.getMemory()[service._key(mockMark)]).toEqual(mockMark);
    });
    it("should return nothing", () => {
      expect(service.addHash(mockMark)).toBeUndefined();
    });
  });

  describe("removeHash", () => {
    beforeEach(() => {
      mocked.map(mark => service.addHash(mark));
    });
    it("should add _deletedAt property to the mark", () => {
      service.removeHash(mockMark);
      expect(Object.values(service.getMemory()).filter(mark => mark._deletedAt !== undefined).length)
        .toBe(1);
    });
    it("should return nothing", () => {
      expect(service.removeHash(mockMark)).toBeUndefined();
    })
  });

  describe("replaceHash", () => {
    beforeEach(() => {
      mocked.map(mark => service.addHash(mark));
    });
    it("should return nothing", () => {
      expect(service.replaceHash(mockMark1)).toBeUndefined();
    })
    it("should replace existed value with a new one", () => {
      const newMark: Mark = {...mockMark};
      newMark.value = 2;
      service.replaceHash(newMark);
      expect(service.getMemory()[service._key(newMark)].value).toEqual(2);
    });
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
  it("_key should return function", () => {
    expect(typeof service._key === "function").toBe(true);
  });
});
