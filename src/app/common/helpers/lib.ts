export function pluck(source: Array<any>, prop: string): Array<any> {
  const result: Array<any> = [];
  source.map(item => result.push(item[prop]));
  return result;
}

export const _dispatcher: Function = (store, dispatcher, name) => (value) => store.dispatch(dispatcher({[name]: value}));
export const _dispatcherNgxs: Function = (store, dispatcher) => (payload) => store.dispatch(new dispatcher(payload));
