export function pluck(source: Array<any>, prop: string): Array<any> {
  const result: Array<any> = [];
  source.map(item => result.push(item[prop]));
  return result;
}
