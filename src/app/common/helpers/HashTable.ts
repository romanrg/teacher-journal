export class HashTable {
  _table: Array<any> = [];
  _hashFunction: Function;
  constructor(hashFunction: HashFunctions) {
    this._hashFunction = hashFunction;
  }
  get data() {
    return this._table.filter(item => item !== undefined);
  }
  public hashCode = (key: string): number => this._hashFunction(key)
  public put = (key: string, value: any): void => this._table[this.hashCode(key)] = value;
  public remove = (key: string): boolean => this._table[this.hashCode(key)] = undefined;
  public value = (key: string): any => this._table[this.hashCode(key)];
  public print = () => console.log(this._table.filter(item => item !== undefined))
  public clear = (): void => this._table.length = 0;
}

export class HashTableWithLinearCollision extends HashTable {
  constructor(hashFunction: HashFunctions) {
    super(hashFunction);
  }

  get data() {
    return this._table.filter(item => item !== undefined).map(({value}) => value);
  }

  public hashCode = (key: string): number => this._hashFunction(key)

  public put = (key: string, value: any): void => {
    const position: number = this.hashCode(key);
    if (this._table[position] === undefined) {
      this._table[position] = {key, value};
    } else {
      let index: number = position + 1;
      while (this._table[index] !== undefined) {
        index++;
      }
      this._table[index] = {key, value};
    }
  };

  public value = (key: string): any|undefined => {
    const position: number = this.hashCode(key);
    console.log(this._table);
    if (this._table[position] !== undefined) {
      if (this._table[position].key === key) {
        return this.this._table[position].value;
      } else {
        let index: number = position + 1;
        while (this._table[position] === undefined || this._table[position].key !== key) {
          index = index + 1;
        }
        if (this._table[position].key === key) {
          return this._table[position].value
        }
      }
    }
    return undefined;
  };

  public remove = (key: string): undefined => {
    const position: number = this.hashCode(key);
    if (this._table[position] !== undefined) {
      if (this._table[position].key === key) {
        this._table[position] = undefined;
      } else {
        let index: number = position + 1;
        while (this._table[position] === undefined || this._table[position].key !== key ) {
          index = index + 1;
        }
        if (this._table[position].key === key) {
          this._table[position] = undefined;
        }
      }
    }
    return undefined;
  }

  public clear = (): void => this._table.length = 0;
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
