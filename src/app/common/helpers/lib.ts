export const _pluck: Function = (source: Array<any>, prop: string): Array<any>
  => source.reduce((acc, curr) => acc = [...acc, {[prop]: curr[prop]}], []);
export const _take: Function = (source: Array<any>, prop: string): Array<any>
  => source.reduce((acc, curr) => acc = [...acc, curr[prop]], []);
export const _dispatcherNgxs: Function = (store, dispatcher) => (payload) => store.dispatch(new dispatcher(payload));
export const _allTrue: Function = (...fns) => (elem) => fns.every(fn => fn(elem) === true);
export const _partial: Function = (fn: Function, ...first) => (...second) => fn(...first, ...second);
export const _compose: Function = (...fns) =>
  (...args) =>
    fns.reduceRight((acc, curr) => Array.isArray(acc) ? curr(...acc) : curr(acc), args);
export const copyByJSON: Function = (original: any): any => _compose(JSON.parse, JSON.stringify)(original);
export const _curry: Function = (fn) => (...args) => fn.length ? _curry(fn.bind(null, ...args)) : fn.call(null, ...args);
export const _allPass: Function = (...predicates: Function[]) => (element) => predicates.every(predicate => predicate === true);
export const _chain: Function = (...fns) => fns.map(fn => fn());

export const __filter: Function = (predicate: Function) => (source: Array) => source.filter(predicate);
export class NodeCrawler {
  constructor (node: HTMLElement) {
    this.node = node;
  }

  private runner: Function = (
    predicate: Function
  ): (boolean|HTMLElement) => (predicate(this.node) ? true : this.node.parentNode);
  public crawlUntilTrue = (
    predicate: Function
  )  => {
    let step: (boolean|HTMLElement) = this.runner(predicate);
    while (step !== true) {
      this.node = step;
      step = this.runner(predicate);
    }
    return this.node;
  }
  public getChildsArray = (node: HTMLElement = this.node): HTMLElement[] => [...node.children];
  public executeDOMAttr = (attr: string, key: string, node?: HTMLElement = this.node) => node[attr](key);
  public simpleCheck = (predicate: Function): boolean => {
    return predicate(this.node);
  };
  get tagName(): string {
    return this.node.tagName.toLowerCase();
  }
}
