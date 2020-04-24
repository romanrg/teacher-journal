import { Injectable } from "@angular/core";
import {Mark} from "../models/IMark";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {API, MARKS_ROUTE} from "../constants/API";
@Injectable({
  providedIn: "root"
})


export class MarksServiceService {
  private URL: string = `${API}${MARKS_ROUTE}`;
  private filteredProperties: [string, string] = ["id", "value"];
  private container: {[prop: string]: Mark} = {};
  public _key: Function;
  constructor(private http: HttpClient) {
    this._key = this.getKey(this.filteredProperties);
  }
  public submitMark = (mark: Mark[]): Observable<Mark[]> => {
    return <Observable<Mark[]>>this.http.post(this.URL, mark);
  };

  public getMarks = (): Observable<Mark[]> => <Observable<Mark[]>>this.http.get(this.URL);

  public patchMark(mark: Mark): Observable<Mark> {
    if (mark.id) {
      return <Observable<Mark>>this.http.patch(`${this.URL}/${mark.id}`, mark);
    }
  }

  public getMemory = (): {[prop: string]: Mark}  => this.container;

  public clearMemory = (): {} => this.container = {};

  public deleteMarks = (id: string): Observable<Mark[]> => <Observable<Mark[]>>this.http.delete(`${this.URL}/${id}`);

  public addHash = (item: Mark): void => {
    this.container[this._key(item)] = item;
  };

  public removeHash(item: Mark): void {
    const key: string = this._key(item);
    const shallowCopy: Mark = {...item};
    shallowCopy._deletedAt = Date.now();
    this.container[key] = shallowCopy;
  }

  public replaceHash(item: Mark): void {
    const key: string = this._key(item);
    this.container[key] = item;
  }

  public keyGenerator(mark: Mark, filteredProps: string[]): string {
    return JSON.stringify(
      <any>Object.fromEntries(
        Object
          .entries(mark)
          .filter(([key, value]) => !filteredProps.includes(key)
          )
      )
    );
  }

  public getKey = (properties: [string, string]) => (value: Mark) => this.keyGenerator(value, properties);


}
