

export function pluck(source: Array<any>, prop: string): Array<any> {
  const result: Array<any> = [];
  source.map(item => result.push(item[prop]));
  return result;
}

export const _dispatcherNgxs: Function = (store, dispatcher) => (payload) => store.dispatch(new dispatcher(payload));
export const _partial: Function = (fn: Function, ...first) => (...second) => fn(...first, ...second);
export const _compose: Function = (...fns) =>
  (...args) =>
    fns.reduceRight((acc, curr) => Array.isArray(acc) ? curr(...acc) : curr(acc), args);
export const copyByJSON = (original: any) => _compose(JSON.parse, JSON.stringify)(original);
export class NodeCrawler {
  constructor (node: HTMLElement) {
    this.node = node;
  }

  private runner: Function = (
    conditionCb: Function
  ): (boolean|HTMLElement) => (conditionCb(this.node) ? true : this.node.parentNode)
  public crawlUntilTrue = (
    conditionCb: Function
  )  => {
    let step: (boolean|HTMLElement) = this.runner(conditionCb);
    while (step !== true) {
      this.node = step;
      step = this.runner(conditionCb);
    }
    return this.node;
  }
  public getChildsArray = (node: HTMLElement = this.node): HTMLElement[] => [...node.children];

  public executeDOMAttr = (attr: string, key: string, node?: HTMLElement = this.node) => node[attr](key);
}
