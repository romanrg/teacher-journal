export const _take: Function = (
  source: Array<any>, prop: string
): Array<any> => source.reduce((acc, curr) => acc = [...acc, curr[prop]], []);
export const _dispatcherNgxs: Function = (
  store, dispatcher) => (payload) => store.dispatch(new dispatcher(payload));
export const _allTrue: Function = (
  ...fns) => (elem) => fns.every(fn => fn(elem) === true);
export const _partial: Function = (
  fn: Function, ...first) => (...second) => fn(...first, ...second);
export const _compose: Function = (
  ...fns) => (  ...args) => fns.reduceRight((acc, curr) => Array.isArray(acc) ? curr(...acc) : curr(acc), args);
export const copyByJSON: Function = (
  original: any): any => _compose(JSON.parse, JSON.stringify)(original);
export const _curry: Function = (
  fn) => (  ...args) => fn.length ? _curry(fn.bind(null, ...args)) : fn.call(null, ...args);
export const _allPass: Function = (
  ...predicates: boolean[]) => (element) => predicates.every(predicate => predicate === true);
export const _chain: Function = (...fns) => fns.map(fn => fn());
export const __filter: Function = (
  predicate: (value: never, index: number, array: never[]) => value is never
) => (source: []) => source.filter(predicate);
export const _if: Function = (
  predicate: boolean, leftBranch: Function, rightBranch: Function
) => predicate ? leftBranch : rightBranch;
export const _pluck: Function = (property: string, source: object) => source[property];
export const _reverseArguments: Function = (fn) => (...args) => fn(args.reverse());
export const _range: Function = (start: number, stop: number, step: number): number[] => {
  let a = [start], b = start;
  while (b <= stop) {
    a.push(b += step || 1);
  }
  return a;
};



export class NodeCrawler {
  public node: any;
  constructor (node: any) {
    this.node = node;
  }

  private runner: Function = (
    predicate: (elem: Node) => boolean
  ): true | (Node & ParentNode) => (predicate(this.node) ? true : this.node.parentNode)

  public crawlUntilTrue = (
    predicate: (elem: Node) => boolean
  )  => {
    let step: true | (Node & ParentNode) = this.runner(predicate);
    while (step !== true) {
      this.node = step;
      step = this.runner(predicate);
    }
    return this.node;
  }
  public getChildsArray = (node: any = this.node): any => [...node.children];
  public executeDOMAttr = (attr: string, key: string, node: Node = this.node) => node[attr](key);
  public simpleCheck = (predicate: Function): boolean => predicate(this.node);
  get tagName(): string {
    return this.node.tagName.toLowerCase();
  }
  public changeStyle = (styleProp: string, styleValue: string) => this.node.style[styleProp] = styleValue;
}
