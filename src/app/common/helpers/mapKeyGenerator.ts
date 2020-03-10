import {personizer} from "../constants/personizer";

export const mapKeyGenerator: Function = (row: string[]): string => personizer(row);
