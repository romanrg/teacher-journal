import { Injectable } from "@angular/core";
import {Mark} from "../models/IMark";
import {forkJoin, from, Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {API, MARKS_ROUTE} from "../constants/API";
import {concatMap} from "rxjs/internal/operators";
import {HashFunctions, HashTable} from "../helpers/HashTable";
@Injectable({
  providedIn: "root"
})


export class MarksServiceService {
  private URL: string = `${API}${MARKS_ROUTE}`;
  private memory: HashTable;
  #hash = HashFunctions.knuthMultiplicative;
  constructor(
    private http: HttpClient
  ) {
    this.memory = new HashTable(this.#hash);
  }

  public submitMark(mark: Mark): Observable<Mark[]> {
    console.log(mark);
    return this.http.post(this.URL, mark);
  }
  public getMarks(): Observable<Mark> {
    return this.http.get(this.URL);
  }
  public patchMark(mark: Mark): Observable<Mark> {
    if (mark.id) {
      return this.http.patch(`${this.URL}/${mark.id}`, mark);
    }
  }
  public getMemory(): string  {
      return this.memory.data;
  }
  public clearMemory(): void {
    this.memory.clear();
  }
  public deleteMarks(id: string): Observable<Mark[]> {
    return this.http.delete(`${this.URL}/${id}`);
  }
  public addHash(item: Mark): void {
    const key: string = this.keyGenerator(item, ["id", "value"]);
    this.memory.put(key, item);
  }
  public removeHash(item: Mark): boolean {
    const key: string = this.keyGenerator(item, ["id", "value"]);
    if (item.id) {
      this.memory.remove(key);
      const shallowCopy: Mark = {...item};
      Object.keys(shallowCopy).map(prop => prop === "id" ? shallowCopy[prop] === shallowCopy[prop] : shallowCopy[prop] = null);
      this.memory.put(key, shallowCopy);
    } else {
      this.memory.remove(key);
    }
    this.memory.print();
  }
  public replaceHash(item: Mark): void {
    const key: string = this.keyGenerator(item, ["id", "value"]);
    this.memory.remove(key);
    this.memory.put(key, item);
    this.memory.print();
  }
  public keyGenerator(mark: Mark, filteredProps: string[]): string {
    return JSON.stringify(
      Object.fromEntries(
        Object
          .entries(mark)
          .filter(([key, value]) => !filteredProps.includes(key)
          )
      )
    );
  }
}
