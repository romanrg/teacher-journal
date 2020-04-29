import { Pipe, PipeTransform } from "@angular/core";
import {row} from "../models/ITableConfig";

export type sortingRow = row;
export type unsortedArray = sortingRow[];
export type sortedArray = sortingRow[];
export type comparativeIndex = number;
export type auxMap = {row: number[]|string[], position: number};
export type splicedArray =  {valued: (number|string)[], empty: any[]};
export class SortingCb {
  public static number = (index: comparativeIndex) => (a: auxMap, b: auxMap) => <number>b.row[index] - <number>a.row[index];

  public static string = (index: comparativeIndex) => (a: {row: string[]}, b: {row: string[]}) => a.row[index].localeCompare(b.row[index]);
}

@Pipe({
  name: "sortBy"
})
export class SortByPipe implements PipeTransform {

  public spliceValuedAndEmpty = (
    arr: unsortedArray,
    index: comparativeIndex
  ): splicedArray => arr.reduce(
    (acc, curr) => {
      curr[index] ? acc.valued.push(curr) : acc.empty.push(curr);
      return acc;
      },
    {
      valued: [],
      empty: []
    }
  );

  public getAuxMapFromSortedArray: Function = (
    arr: []
  ): { position: number; row: row; }[] => arr.map((row: sortingRow, position: number) => ({position, row}));

  public isAnyStringValuesForComparision: Function = (
    arr: splicedArray["valued"], index: comparativeIndex
  ): boolean => arr.map(row => row[index]).some(value => typeof value === "string");

  public getSortedArrayFromAuxMap: Function = (
    mapped: auxMap[],
    arr: splicedArray["valued"]
  ): splicedArray["valued"] => mapped.map(row => arr[row.position]);

  public concatenateEmptyWithSorted: Function = (
    empty: splicedArray["empty"]
  ): Function => (sorted: splicedArray["valued"]): sortedArray => <sortedArray><unknown>sorted.concat(empty);

  public transform(value: unsortedArray, index: comparativeIndex, isNotReversed: boolean): sortedArray {

    const splicedForSorting: splicedArray = this.spliceValuedAndEmpty(value, index);

    if (splicedForSorting.valued.length) {

      const concatenateEmptyWith: Function = this.concatenateEmptyWithSorted(splicedForSorting.empty);

      const mapped: auxMap[] = this.isAnyStringValuesForComparision(splicedForSorting.valued, index) ?
         this.getAuxMapFromSortedArray(splicedForSorting.valued).sort(SortingCb.string(index)) :
         this.getAuxMapFromSortedArray(splicedForSorting.valued).sort(SortingCb.number(index));

      if (isNotReversed) {

        return concatenateEmptyWith(this.getSortedArrayFromAuxMap(mapped, splicedForSorting.valued));

      } else {

        return concatenateEmptyWith(this.getSortedArrayFromAuxMap(mapped, splicedForSorting.valued).reverse());

      }
    }

    return value;

  }
}
