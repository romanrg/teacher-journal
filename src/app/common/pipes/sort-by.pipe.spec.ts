import {SortByPipe, sortedArray, SortingCb, splicedArray} from "./sort-by.pipe";
import {row} from "../models/ITableConfig";

describe("SortByPipe", () => {

  let pipe: SortByPipe;
  let mockData: any[] = [
    ["name", "surname", "9.5", 10, 9],
    ["name_2", "surname_2", "7.5", 8, 7],
    ["name_4", "surname_4", undefined, undefined, undefined],
    ["name_3", "surname_3", "5", 5, 5],
    ["name_1", "surname_1", "6", 10, 2],
  ];
  let index: number = 3;
  beforeEach(() => {
    pipe = new SortByPipe();
  });

  it("create an instance", () => {
    expect(pipe).toBeTruthy();
  });

  describe("spliceValuedAndEmpty", () => {
    it("should return object", () => {
      const spliced: splicedArray = pipe.spliceValuedAndEmpty(mockData, index);
      expect(typeof spliced === "object" && spliced !== null).toBe(true);
    });
    it("returned object should have 'empty' property", () => {
      const spliced: splicedArray = pipe.spliceValuedAndEmpty(mockData, index);
      expect(Object.keys(spliced)).toContain("empty");
    });
    it("'empty' property should be array", () => {
      const spliced: splicedArray = pipe.spliceValuedAndEmpty(mockData, index);
      expect(Array.isArray(spliced.empty)).toBe(true);
    });
    it("returned object should have 'valued' property", () => {
      const spliced: splicedArray = pipe.spliceValuedAndEmpty(mockData, index);
      expect(Object.keys(spliced)).toContain("valued");
    });
    it("'valued' property should be array", () => {
      const spliced: splicedArray = pipe.spliceValuedAndEmpty(mockData, index);
      expect(Array.isArray(spliced.valued)).toBe(true);
    });
    it("should divide data by the data[index] value", () => {
      const spliced: splicedArray = pipe.spliceValuedAndEmpty(mockData, index);
      expect(spliced.empty.length === 1 && spliced.valued.length === 4).toBe(true);
    });
    it("returned value 'empty' property should contain only arrays with undefined at index position", () => {
      const spliced: splicedArray = pipe.spliceValuedAndEmpty(mockData, index);
      const empty: any[] = spliced.empty;
      empty.map(emptyData => expect(emptyData[index]).toBeUndefined());
    });
    it("returned value 'valued' property should contain only arrays with defined value at index position", () => {
      const spliced: splicedArray = pipe.spliceValuedAndEmpty(mockData, index);
      const valued: (number|string)[] = spliced.valued;
      valued.map(valuedData => expect(valuedData[index]).toBeDefined());
    });

  });

  describe("isAnyStringValuesForComparision", () => {

    let spliced: splicedArray;
    beforeEach(() => {
      spliced = pipe.spliceValuedAndEmpty(mockData, index);
    });

    it("should return boolean", () => {
      expect(typeof pipe.isAnyStringValuesForComparision(spliced.valued, index) === "boolean").toBe(true);
    });

    it("should return true if any value at index is a string", () => {
      expect(pipe.isAnyStringValuesForComparision(spliced.valued, 0)).toBe(true);
    });

    it("should return false if every value at index is not a string", () => {
      expect(pipe.isAnyStringValuesForComparision(spliced.valued, 5)).toBe(false);
    });


  });

  describe("getAuxMapFromSortedArray", () => {
    let map: { position: number; row: row; }[];
    beforeEach(() => {
      map = pipe.getAuxMapFromSortedArray(mockData);
    });
    it("should return array", () => {
      expect(Array.isArray(map)).toBe(true);
    });
    it("returned array should consist of objects", () => {
      map.forEach(value => expect(typeof value === "object" && value !== null).toBe(true));
    });
    it("objects inside array should have 'position' property", () => {
      map.forEach(value => expect(Object.keys(value)).toContain("position"));
    });
    it("'row' property should be equal to the sorted array at 'position' index", () => {
      map.forEach(value => expect(Object.is(value.row, mockData[+value.position])).toEqual(true));
    });
    it("objects inside array should have 'row' property", () => {
      map.forEach(value => expect(Object.keys(value)).toContain("row"));
    });

  });

  describe("getSortedArrayFromAuxMap", () => {
    let valued: splicedArray["valued"];
    let map: { position: number; row: row; }[];
    beforeEach(() => {
      map = pipe.getAuxMapFromSortedArray(mockData);
      valued = pipe.spliceValuedAndEmpty(mockData, index).valued;
    });

    it("should return array", () => {
      expect(Array.isArray(pipe.getSortedArrayFromAuxMap(map, valued))).toBe(true);
    });
  });

  describe("concatenateEmptyWithSorted", () => {
    it("should return function named further 'concatenated'", () => {
      const spliced: splicedArray = pipe.spliceValuedAndEmpty(mockData, index);
      expect(typeof pipe.concatenateEmptyWithSorted(spliced.empty) === "function").toBe(true);
    });

    it("concatenated should return array after execution", () => {
      const spliced: splicedArray = pipe.spliceValuedAndEmpty(mockData, index);
      expect(Array.isArray(pipe.concatenateEmptyWithSorted(spliced.empty)(spliced.valued))).toBe(true);
    });

    it("concatenated should return array that contains only values from pipe input", () => {
      const spliced: splicedArray = pipe.spliceValuedAndEmpty(mockData, index);
      const result: sortedArray = pipe.concatenateEmptyWithSorted(spliced.empty)(spliced.valued);
      result.forEach(value => expect(mockData).toContain(value));
    });
  });

  describe("transform", () => {
    it("should sort as strings if any value at index is string", () => {
      const spy: any = spyOn(SortingCb, "string");
      pipe.transform(mockData, 0, true);
      expect(SortingCb.string).toHaveBeenCalled();
    });
    it("should sort as numbers if all value at index is number or undefined", () => {
      const spy: any = spyOn(SortingCb, "number");
      pipe.transform(mockData, 4, true);
      expect(spy).toHaveBeenCalled();
    });
    it ("should return sorted array", () => {
      const data: any[] = [
        ["name", "surname", "9.5", 10, 9],
        ["name_2", "surname_2", "7.5", 8, 7],
        ["name_3", "surname_3", undefined, undefined, undefined],
      ];
      const reversed: any[] = [
        ["name_2", "surname_2", "7.5", 8, 7],
        ["name_3", "surname_3", undefined, undefined, undefined],
        ["name", "surname", "9.5", 10, 9],
      ];
      expect(pipe.transform(reversed, index, true)).toEqual(data);
    });
    it ("should return reversed arrays if 3rd argument is false", () => {
      const data: any[] = [
        ["name", "surname", "9.5", 10, 9],
        ["name_2", "surname_2", "7.5", 8, 7],
      ];
      const reversed: any[] = [
        ["name_2", "surname_2", "7.5", 8, 7],
        ["name", "surname", "9.5", 10, 9],
      ];
      expect(pipe.transform(data, index, false)).toEqual(reversed);
    });
  });
});
