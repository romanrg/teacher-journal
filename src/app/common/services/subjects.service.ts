import { Injectable } from "@angular/core";
import {ISubject} from "../models/ISubject";
import {from, Observable, of} from "rxjs";
import {map, withLatestFrom} from "rxjs/internal/operators";
import {Params} from "@angular/router";
import {IStudent} from "../models/IStudent";
import {HttpClient} from "@angular/common/http";
import {API, SUBJECTS_ROUTE} from "../constants/API";
import {ITeacher} from "../models/ITeacher";

const subjects: ISubject[] = [
  {
    _id: 0,
    name: "math",
    teacher: "Ivanova A.",
    address: "pr. Zhukova 29",
    description: "Lorem ipsum dolor sit amet, " +
    "consectetur adipiscing elit, sed do eiusmod tempor incididunt " +
    "ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis " +
    "nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo " +
    "consequat. Duis aute irure dolor in reprehenderit in voluptate velit" +
    " esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaeca" +
    "t cupidatat non proident, sunt in culpa qui officia deserunt mollit " +
    "anim id est laborum.",
    students: new Map(),
    uniqueDates: [],
  },
  {
    _id: 1,
    name: "chemistry",
    teacher: "Ivanova V.",
    address: "pr. Zhukova 29",
    description: "Lorem ipsum dolor sit amet, " +
    "consectetur adipiscing elit, sed do eiusmod tempor incididunt " +
    "ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis " +
    "nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo " +
    "consequat. Duis aute irure dolor in reprehenderit in voluptate velit" +
    " esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaeca" +
    "t cupidatat non proident, sunt in culpa qui officia deserunt mollit " +
    "anim id est laborum.",
    students: new Map(),
    uniqueDates: [],
  },
  {
    _id: 2,
    name: "history",
    teacher: "Ivanova A.",
    address: "pr. Zhukova 29",
    description: "Lorem ipsum dolor sit amet, " +
    "consectetur adipiscing elit, sed do eiusmod tempor incididunt " +
    "ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis " +
    "nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo " +
    "consequat. Duis aute irure dolor in reprehenderit in voluptate velit" +
    " esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaeca" +
    "t cupidatat non proident, sunt in culpa qui officia deserunt mollit " +
    "anim id est laborum.",
    students: new Map(),
    uniqueDates: [],
  }
];

@Injectable({
  providedIn: "root"
})
export class SubjectsService {
  private URL: string = `${API}${SUBJECTS_ROUTE}`;
  private _subjects: ISubject[];
  constructor(
    private http: HttpClient
  ) {
    this._subjects = [];
  }

  public fetchSubjects(): Observable<ISubject[]> {
    return this.http.get(this.URL);
  }

  set subjects(arr: ISubject[]): ISubject[] {
    this._subjects = arr;
  }

  get subjects(): ISubject[] {
    return this._subjects;
  }

  public addSubject(subject: ISubject): void {
    subject.uniqueDates = [];
    this.http.post(this.URL, subject).subscribe(data => console.log(data));
  }

  public patchSubject(subject: ISubject): void {
    this.http.patch(`${this.URL}/${subject.id}`, subject).subscribe();
  }

  public addUniqueDate(id: (string|number), date: number): void {
    this._subjects.filter(sub => sub.id === id)[0].uniqueDates.push(date);
    const subject: ISubject = this._subjects.filter(sub => sub.id === id)[0];
    this.patchSubject(subject);
  }

  public getUniqueDatesById(id: string ): number[] {
    return this._subjects.filter(sub => sub.id === id)[0].uniqueDates.filter((a, b) => a - b);
  }

}
