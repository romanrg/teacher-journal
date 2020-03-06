import { Injectable } from "@angular/core";
import {ISubject} from "../models/ISubject";
import {from, Observable} from "rxjs";
import {map, withLatestFrom} from "rxjs/internal/operators";
import {Params} from "@angular/router";

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
    "anim id est laborum."
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
    "anim id est laborum."
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
    "anim id est laborum."
  }
];

@Injectable({
  providedIn: "root"
})
export class SubjectsService {

  private _subjects$: Observable<ISubject[]>;
  constructor() {
    this._subjects$ = from([subjects]);
  }

  get subjects(): Observable<ISubject[]> {
    return this._subjects$;
  }
  public addSubject(subject: ISubject): void {
    subject._id = subjects.length;
    subjects.push(subject);
  }

  public getSubjectByIdFromRoute(routerParams: Observable<Params>): Observable<ISubject[]> {
    return this._subjects$
      .pipe(
        withLatestFrom(routerParams),
        map(data => data[0].filter(sub => sub._id === +data[1].id))
      );
  }
}
