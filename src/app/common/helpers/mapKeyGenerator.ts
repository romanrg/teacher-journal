import {personizer} from "../constants/personizer";

export const mapKeyGenerator: Function = (row: string[]): string => JSON.stringify(personizer(row[0], row[1]));
