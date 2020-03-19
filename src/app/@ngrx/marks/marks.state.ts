import {Mark} from "../../common/models/IMark";

export interface MarksState {
  data: ReadonlyArray<Mark>;
  readonly loading: boolean;
  readonly loaded: boolean;
  readonly error: Error | string;
}

export const initialMarksState: StudentsState = {
  data: [],
  loading: false,
  loaded: false,
  error: null,
};
