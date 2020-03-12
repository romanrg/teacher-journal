import { Pipe, PipeTransform } from "@angular/core";

const sortingFunctionForStringsHigh: Function = (index: number) => (a: string[], b: string[]) => {
  if (a[index] < b[index]) {
    return -1;
  }
  if (a[index] > b[index]) {
    return 1;
  }
  return 0;
};
const sortingFunctionForNumbersHigh: Function = (index: number) => (a: number[], b: number[]) => {
  let curr: (number) = a[index];
  let next: (number)  = b[index];
  if (!curr) {
    curr = 0;  }

  if (!next) {
    next = 0;
  }
  return  next - curr;
};


let wasSorted: number;
let isLow: boolean = false;

@Pipe({
  name: "sortBy"
})
export class SortByPipe implements PipeTransform {
  public transform(value: (string|number)[][], index: number): string[][] {
    let shouldSortNumbers: boolean = false;
    if (!wasSorted || wasSorted !== index) {
      wasSorted = index;
      isLow = false;
      value.forEach(row => {
        if (typeof row[0] === "number") {
          return;
        } else if (index > 1) {
          shouldSortNumbers = true;
        }
      });
      const compareFn: Function = shouldSortNumbers ? sortingFunctionForNumbersHigh(index) : sortingFunctionForStringsHigh(index);
      return value.sort(compareFn);
    } else {
      if (wasSorted === index) {
        value.forEach(row => {
          if (typeof row[0] === "number") {
            return;
          } else if (index > 1) {
            shouldSortNumbers = true;
          }
        });
        if (isLow) {
          isLow = !isLow;
          const compareFn: Function = shouldSortNumbers ? sortingFunctionForNumbersHigh(index) : sortingFunctionForStringsHigh(index);
          return value.sort(compareFn);
        } else {
          isLow = !isLow;
          const compareFn: Function = shouldSortNumbers ? sortingFunctionForNumbersHigh(index) : sortingFunctionForStringsHigh(index);
          return value.sort(compareFn).reverse();
        }

      }
    }

  }
}
