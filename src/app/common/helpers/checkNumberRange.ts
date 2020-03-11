export const checkNumberRange: Function = (
  num: number, [min, max], isInclude: boolean = true
): boolean => {
  return isInclude ? ( num >= min && num <= max) : (num > min && num < max);
};

export const idGeneretor: Function = () => `f${(~~(Math.random()*1e8)).toString(16)}`;
