import { Injectable } from "@angular/core";
import {Mark} from "../models/IMark";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {API, MARKS_ROUTE} from "../constants/API";
import {HashFunctions, HashTable, HashTableWithLinearCollision} from "../helpers/HashTable";
@Injectable({
  providedIn: "root"
})


export class MarksServiceService {
  private URL: string = `${API}${MARKS_ROUTE}`;
  private memory: HashTable;
  private filteredProperties: [string, string] = ["id", "value"];
  #hash = HashFunctions.djb2HashCode;
  constructor(private http: HttpClient) {
    this.memory = new HashTable(this.#hash);
  }
  public submitMark = (mark: Mark): Observable<Mark[]> => {
    return this.http.post(this.URL, mark);
  };

  public getMarks = (): Observable<Mark> => this.http.get(this.URL);

  public patchMark(mark: Mark): Observable<Mark> {
    if (mark.id) {
      return this.http.patch(`${this.URL}/${mark.id}`, mark);
    }
  }

  public getMemory = (): string  => this.memory.data;

  public clearMemory = (): void => this.memory.clear();

  public deleteMarks = (id: string): Observable<Mark[]> => this.http.delete(`${this.URL}/${id}`);

  public addHash = (item: Mark): void => {
    this.memory.put(this._key(item), item);
  };

  public removeHash(item: Mark): boolean {
    const key: string = this._key(item);
    const shallowCopy: Mark = {...item};
    shallowCopy._deletedAt = Date.now();
    this.memory.remove(key);
    this.memory.put(this._key(item), shallowCopy);
  }

  public replaceHash(item: Mark): void {
    const key: string = this._key(item);
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

  public getKey = (properties: [string, string]) => (value: Mark) => this.keyGenerator(value, properties);

  public _key: Function = this.getKey(this.filteredProperties);
}
