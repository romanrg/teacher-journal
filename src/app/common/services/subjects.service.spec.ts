import { TestBed } from "@angular/core/testing";

import { SubjectsService } from "./subjects.service";
import {HttpClientModule} from "@angular/common/http";
import {Observable} from "rxjs";
import {ISubject, SubjectModel} from "../models/ISubject";

fdescribe("SubjectsService", () => {

  let service: SubjectsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [SubjectsService]
    });
    service = TestBed.inject(SubjectsService);
  });
  // fetchSubjects
  describe("fetchSubjects", () => {
    let result: Observable<ISubject[]>;
    beforeEach(() => {
      result = service.fetchSubjects();
    });
    it("should return Observable further named as subjects$", () => {
      expect(result instanceof Observable).toBe(true);
    });

    it("subjects$ data should be array", (done: DoneFn) => {
      result.subscribe(subjects => {
        expect(Array.isArray(subjects)).toBe(true);
        done()
      });
    });

    it("subjects$ data should be array of subjects", (done: DoneFn) => {
      result.subscribe(response => {
        response.forEach(subject =>
          expect(Object.keys(subject).sort()).toEqual(["name", "teacher", "uniqueDates", "address", "description", "_id", "_deletedAt" , "__v"].sort())
        );
        done();
      });
    });
  });

  // addSubject
  describe("addSubject", () => {
    /*
    it("should do something", () => {

    });
    */
  });

  // patchSubject
  describe("patchSubject", () => {
    /*
    it("should do something", () => {

    });
    */
  });

  // deleteSubject
  describe("deleteSubject", () => {
    /*
    it("should do something", () => {

    });
    */
  });

  // updateSubjectState
  describe("updateSubjectState", () => {

    it("should set subjectToUpdate", () => {
      const mockSubject: ISubject = new SubjectModel("math", "Sidorova", "314", "Math classes", [1111]);
      service.updateSubjectState(mockSubject);
      expect(service.subjectToUpdate).toEqual(mockSubject);
    });

    it("should change subjectToUpdate", () => {
      const mockSubject: SubjectModel = new SubjectModel("math", "Sidorova", "314", "Math classes", [1111]);
      service.updateSubjectState(mockSubject);
      const copy: SubjectModel = {...mockSubject};
      copy.uniqueDates = [1, 2, 3, 4, 5];
      service.updateSubjectState(copy);
      expect(service.subjectToUpdate.uniqueDates).toEqual([1, 2, 3, 4, 5]);
    });

  });

  // subjectToUpdate
  describe("subjectToUpdate", () => {

    it("should return ISubject", () => {
      const mockSubject: ISubject = new SubjectModel("math", "Sidorova", "314", "Math classes", [1111]);
      service.updateSubjectState(mockSubject);
      expect(service.subjectToUpdate instanceof SubjectModel).toBe(true);
    });

  });


  it("should be created", () => {
    expect(true).toBeTruthy();
  });
});
