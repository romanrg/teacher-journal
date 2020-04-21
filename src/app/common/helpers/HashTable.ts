export class HashTable {
  #table: Array<any> = [];
  #hashFunction: Function;
  constructor(hashFunction: HashFunctions) {
    this.#hashFunction = hashFunction;
  }
  get data() {
    return this.#table.filter(item => item !== undefined);
  }
  public hashCode = (key: string): number => this.#hashFunction(key)
  public put = (key: string, value: any): void => this.#table[this.hashCode(key)] = value;
  public remove = (key: string): boolean => this.#table[this.hashCode(key)] = undefined;
  public value = (key: string): any => this.#table[this.hashCode(key)];
  public print = () => console.log(this.#table.filter(item => item !== undefined))
  public clear = (): void => this.#table.length = 0;
}

export class HashTableWithLinearCollision extends HashTable {

  #table: Array<any> = [];
  #hashFunction: Function;
  constructor(hashFunction: HashFunctions) {
    super(hashFunction);
  }

  get data() {
    return this.#table.filter(item => item !== undefined).map(({value}) => value);
  }

  public put = (key: string, value: any): void => {
    const position: number = this.hashCode(key);
    if (this.#table[position] === undefined) {
      this.#table[position] = {key, value};
    } else {
      let index: number = position + 1;
      while (this.#table[index] !== undefined) {
        index++;
      }
      this.#table[index] = {key, value};
    }
  };

  public value = (key: string): any|undefined => {
    const position: number = this.hashCode(key);
    if (this.#table[position] !== undefined) {
      if (this.#table[position].key === key) {
        return this.this.#table[position].value;
      } else {
        let index: number = position + 1;
        while (this.#table[position] === undefined || this.#table[position].key !== key) {
          index = index + 1;
        }
        if (this.#table[position].key === key) {
          return this.#table[position].value
        }
      }
    }
    return undefined;
  };

  public remove = (key: string): undefined => {
    const position: number = this.hashCode(key);
    if (this.#table[position] !== undefined) {
      if (this.#table[position].key === key) {
        this.#table[position] = undefined;
      } else {
        let index: number = position + 1;
        while (this.#table[position] === undefined || this.#table[position].key !== key ) {
          index = index + 1;
        }
        if (this.#table[position].key === key) {
          this.#table[position] = undefined;
        }
      }
    }
    return undefined;
  }
}

export class HashFunctions {
  public static loseHash = (key: string): number => {
    let hash: number = 0;

    for (let i: number = 0; i < key.length; i++) {
      hash = hash + key.charCodeAt(i);
    }
    return hash % 37;
  };

  public static djb2HashCode = (key: string): number => {
    let hash: number = 5381;
    for (let i: number = 0; i < key.length; i++) {
      hash = hash * 33 + key.charCodeAt(i);
    }
    return hash % 1013;
  };

  public static knuthMultiplicative = (key: string): number => HashFunctions.loseHash(key) * (2 ^ 32);
}
