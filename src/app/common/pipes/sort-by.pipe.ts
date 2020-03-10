import { Pipe, PipeTransform } from "@angular/core";

const sortingFunctionForStrings: Function = (index: number) => (a: string[], b: string[]) => {
  if (a[index] < b[index]) {
    return -1;
  }
  if (a[index] > b[index]) {
    return 1;
  }
  return 0;
};

const sortingFunctionForNumbers: Function = (index: number) => (a: number[], b: number[]) => {
  let curr: (number|string) = a[index];
  let next: (number|string)  = b[index];
  return  next - curr;
};

@Pipe({
  name: "sortBy"
})
export class SortByPipe implements PipeTransform {
  public transform(value: (string|number)[][], index: number): string[][] {
    let shouldSortNumbers: boolean = false;
    value.forEach(row => {
      row.forEach(cell => {
        if (typeof cell === 'number') {
          shouldSortNumbers = true;
          return;
        }
      });
    });

    const compareFn: Function = shouldSortNumbers ? sortingFunctionForNumbers(index) : sortingFunctionForStrings(index);
    return value.sort(compareFn);
  }
}
