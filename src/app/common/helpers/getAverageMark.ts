export const getAverageMark: Function = (arr: []): number => {
  const filtered: number[] = arr.filter(mark => typeof mark === 'number');
  return (filtered.reduce((cur, acc) => cur + acc) / filtered.length);
};
