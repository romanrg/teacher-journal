import { TestBed } from "@angular/core/testing";

import { StudentsServiceService } from "./students.service";
import {HttpClientModule} from "@angular/common/http";
import {IStudent} from "../models/IStudent";
import {Observable} from "rxjs";

describe("StudentsServiceService", () => {
  let service: StudentsServiceService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [StudentsServiceService]
    });
    service = TestBed.inject(StudentsServiceService);
  });

  it("should be created", () => {
    expect(true).toBeTruthy();
  });

  // addStudent
  describe("addStudent", () => {

  });

  // fetchStudents
  describe("fetchStudents", () => {
    let result: Observable<IStudent[]>;

    beforeEach(() => {
      result = service.fetchStudents();
    });

    it("should return Observable", () => {
      expect(result instanceof Observable).toBe(true);
    });

    it("returned Observable should be array", (done: DoneFn) => {
      result.subscribe(students => {
        expect(Array.isArray(students)).toBe(true);
        done();
      });
    });

    it("returned Observable should consist of students array", (done: DoneFn) => {
      result.subscribe(response => {
        response.forEach(student =>
          expect(Object.keys(student).sort()).toEqual(["name", "surname", "address", "description", "_id", "_deletedAt" , "__v"].sort())
        );
        done();
      });
    });
  })

  // removeStudent
  describe("removeStudent", () => {
  });
});
