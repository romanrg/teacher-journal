export class HashTable {
  #table: Array<any> = [];
  #hashFunction: Function;
  constructor(hashFunction) {
    this.#hashFunction = hashFunction;
  }
  get data() {
    return this.#table.filter(item => item !== undefined);
  }
  public hashCode = (key: string): number => this.#hashFunction(key);
  public put = (key: string, value: any): void => this.#table[this.hashCode(key)] = value;
  public remove = (key: string): boolean => this.#table[this.hashCode(key)] = undefined;
  public value = (key: string): any => this.#table[this.hashCode(key)];
  public print = () => console.log(this.#table.filter(item => item !== undefined))
  public clear = (): void => this.#table.length = 0;
}

export class HashFunctions {
  public static loseHash = (key: string): number => {
    let hash: number = 0;

    for (let i: number = 0; i < key.length; i++) {
      hash = hash + key.charCodeAt(i);
    }
    return hash % 37;
  };

  public static knuthMultiplicative = (key: string): number => HashFunctions.loseHash(key) * (2 ^ 32);
}
