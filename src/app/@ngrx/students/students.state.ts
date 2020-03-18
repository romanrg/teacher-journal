import { IStudent } from "../../common/models/IStudent";

export interface StudentsState {
  data: ReadonlyArray<IStudent>;
  readonly loading: boolean;
  readonly loaded: boolean;
  readonly error: Error | string;
  searchedStudents?: ReadonlyArray<IStudent>;
}

export const initialStudentsState: StudentsState = {
  data: [],
  loading: false,
  loaded: false,
  error: null,
  searchedStudents: null,
};
