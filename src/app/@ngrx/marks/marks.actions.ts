import {ActionCreator, createAction, props} from "@ngrx/store";
import {Mark} from "../../common/models/IMark";


export const getMarks: ActionCreator = createAction(
  "[Main Page (App)] GET_MARKS"
);

export const getMarksSuccess: ActionCreator = createAction(
  "[Get Marks Effect] GET_MARKS_SUCCESS",
  props<{marks: Mark[]}>()
);
export const getMarksError: ActionCreator = createAction(
  "[Get Marks Effect] GET_MARKS_ERROR",
  props<{error: Error | string}>()
);

/*
export const createStudent: ActionCreator = createAction(
  "[Students Form Page] CREATE_STUDENT",
  props<{student: IStudent}>()
);
export const createStudentSuccess: ActionCreator = createAction(
  "[Create Student Effect] CREATE_STUDENT_SUCCESS",
  props<{student: IStudent}>()
);
export const createStudentError: ActionCreator = createAction(
  "[Create Student Effect] CREATE_STUDENT_ERROR",
  props<{error: Error | string}>()
);

export const deleteStudent: ActionCreator = createAction(
  "[Students Table Page] DELETE_STUDENT",
  props<{id: string}>()
);
export const deleteStudentSuccess: ActionCreator = createAction(
  "[Delete Student Effect] DELETE_STUDENT_SUCCESS",
  props<{id: string}>()
);
export const deleteStudentError: ActionCreator = createAction(
  "[Delete Student Effect] DELETE_STUDENT_ERROR",
  props<{error: Error | string}>()
);
export const searchStudentsBar: ActionCreator = createAction(
  "[Students Table Page] SEARCH_STUDENTS_BAR",
  props<{searchString: string}>()
);
export const searchStudentsBarSuccess: ActionCreator = createAction(
  "[Students Table Page] SEARCH_STUDENTS_BAR_SUCCESS",
  props<{students: IStudent[]}>()
);

export const getStudentsForSubjects: ActionCreator = createAction(
  "[Subject Table Page] GET_STUDENTS"
);
*/
