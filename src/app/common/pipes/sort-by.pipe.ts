import { Pipe, PipeTransform } from "@angular/core";
@Pipe({
  name: "sortBy"
})
export class SortByPipe implements PipeTransform {
  public transform(value: (string|number)[][], index: number, isReversed: boolean): string[][] {
    if (!value.map(row => row[index]).filter(val => val).length) {
      return value;
    } else {
      const withVal: (string|number)[] = value.filter(row => row[index]);
      const withNoVal: undefined[] = value.filter(row => !row[index]);
      const mapped: any = withVal.map((row, i) => ({i, row}));
      if (withVal.map(row => row[index]).some(val => typeof val === "string")) {
        const sorted = mapped.sort((a, b) => a.row[index].localeCompare(b.row[index]));
        const result = mapped.map(row => withVal[row.i]);
        if (isReversed) {
          return [...result, ...withNoVal];
        } else {
          return [...result.reverse(), ...withNoVal];
        }
      } else {
        const sorted = mapped.sort((a, b) => b.row[index] - a.row[index]);
        const result = mapped.map(row => withVal[row.i]);
        if (isReversed) {
          return [...result, ...withNoVal];
        } else {
          return [...result.reverse(), ...withNoVal];
        }

      }
    }
  }
}
