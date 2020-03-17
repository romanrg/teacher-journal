import {ActionCreator, createAction, props} from "@ngrx/store";
import { IStudent } from "../../common/models/IStudent";

export const getStudents: ActionCreator = createAction(
  "[Students Table Page (App)] GET_STUDENTS"
);
export const getStudent: ActionCreator = createAction(
  "[Students Table Page] GET_STUDENT",
  props<{studentId: string}>()
);
export const createStudent: ActionCreator = createAction(
  "[Students Form Page] CREATE_STUDENT",
  props<{student: IStudent}>()
);
export const deleteStudent: ActionCreator = createAction(
  "[Students Table Page] DELETE_STUDENTS",
  props<{id: string}>()
);
