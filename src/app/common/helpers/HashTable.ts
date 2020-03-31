export class HashTable {
  #table: Array<any>;
  #hashFunction: Function;
  constructor(hashFunction) {
    this.#table = [];
    this.#hashFunction = hashFunction;
  }
  public hashCode(key: string): number {
    return this.#hashFunction(key);
  }
  public put(key, value): void {
    this.#table[this.hashCode(key)] = value;
  }
  public remove(key): boolean {
    this.#table[this.hashCode(key)] = undefined;
  }
  public value(key): any {
    return this.#table[this.hashCode(key)];
  }
  public print() {
    console.log(this.#table.filter(item => item !== undefined))
  }
  get data() {
    return this.#table.filter(item => item !== undefined);
  }
  public clear() {
    this.#table.length = 0;
  }
}

export class HashFunctions {
  public static loseHash(key: string): number {
    let hash: number = 0;

    for (let i = 0; i < key.length; i++) {
      hash = hash + key.charCodeAt(i);
    }
    return hash % 37;
  }

  public static knuthMultiplicative(key: string): number {
    return HashFunctions.loseHash(key) * (2 ^ 32);
  }
}
