export const checkNumberRange: Function = (
  num: number, [min, max], isInclude: boolean = true
): boolean => {
  return isInclude ? ( num >= min && num <= max) : (num > min && num < max);
};
