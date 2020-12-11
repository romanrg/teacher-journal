import { Pipe, PipeTransform } from "@angular/core";
import {row} from "../models/ITableConfig";
@Pipe({
  name: "sortBy"
})

enum splicedArray {valued, empty}
enum auxMap {row, position}
enum sortingCb {
  number = (index: comparativeIndex): Function => (a: auxMap, b: auxMap) => b.row[index] - a.row[index],
  string = (index: comparativeIndex): Function => (a: auxMap, b: auxMap) => a.row[index].localeCompare(b.row[index])
}
type sortingRow = row;
type unsortedArray = sortingRow[];
type sortedArray = sortingRow[];
type comparativeIndex = number;
export class SortByPipe implements PipeTransform {
  public spliceValuedAndEmpty = (arr: unsortedArray, index: comparativeIndex): splicedArray => {
    let result: splicedArray = {valued: [], empty: []};
    arr.map(row => row[index] ? result.valued.push(row) : result.empty.push(row));
    return result;
  };
  public getAuxMapFromSortedArray: Function = (arr: valuedArray
  ): auxMap[] => arr.map((row: sortingRow, position: number) => ({position, row}))
  public isAnyStringValuesForComparision: Function = (
    arr: splicedArray.valued, index: comparativeIndex
  ): boolean => arr.map(row => row[index]).some(value => typeof value === "string")
  public getSortedArrayFromAuxMap: Function = (
    mapped: auxMap[],
    arr: splicedArray.valued
  ): splicedArray.valued => mapped.map(row => arr[row.position]);
  public concatenateEmptyWithSorted: Function = (
    empty: splicedArray.empty
  ): Function => (sorted: splicedArray.valued): sortedArray => sorted.concat(empty);

  public transform(value: unsortedArray, index: comparativeIndex, isNotReversed: boolean): sortedArray {
    const splicedForSorting: splicedArray = this.spliceValuedAndEmpty(value, index);
    if (splicedForSorting.valued.length) {
      const concatenateEmptyWith: Function = this.concatenateEmptyWithSorted(splicedForSorting.empty);
      const mapped: auxMap[] = this.isAnyStringValuesForComparision(splicedForSorting.valued, index) ?
         this.getAuxMapFromSortedArray(splicedForSorting.valued).sort(sortingCb.string(index)) :
         this.getAuxMapFromSortedArray(splicedForSorting.valued).sort(sortingCb.number(index));
      if (isNotReversed) {
        return concatenateEmptyWith(this.getSortedArrayFromAuxMap(mapped, splicedForSorting.valued));
      } else {
        return concatenateEmptyWith(this.getSortedArrayFromAuxMap(mapped, splicedForSorting.valued).reverse());
      }
    }
    return value;
  }
}
