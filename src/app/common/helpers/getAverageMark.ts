export const getAverageMark: Function = (arr: []): number => {
  const filtered: number[] = arr.filter(mark => mark);
  return (filtered.reduce((cur, acc) => +cur + +acc, 0) / filtered.length);
};
