import {ISubject} from "../../common/models/ISubject";

export interface SubjectsState {
  data: ReadonlyArray<ISubject>;
  readonly loading: boolean;
  readonly loaded: boolean;
  readonly error: Error | string;
}

export const initialSubjectsState: SubjectsState = {
  data: [],
  loading: false,
  loaded: false,
  error: null,
};
