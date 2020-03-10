export const personizer: Function = ( row: string[]): string => {
  return JSON.stringify({name: row[0], surname: row[1]})
};
