import {ActionCreator, createAction, props} from "@ngrx/store";
import {Mark} from "../../common/models/IMark";
import {ISubject} from "../../common/models/ISubject";

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

export const addNewMark: ActionCreator = createAction(
  "[New Mark Form] ADD_NEW_MARK",
  props<{mark: Mark}>()
);
export const addNewMarkSuccess: ActionCreator = createAction(
  "[Add New Mark Effect] ADD_NEW_MARK_SUCCESS",
  props<{mark: Mark}>()
);
export const addNewMarkError: ActionCreator = createAction(
  "[Add New Mark Effect] ADD_NEW_MARK_ERROR",
  props<{error: Error | string}>()
);
export const changeMark: ActionCreator = createAction(
  "[New Mark Form] CHANGE_MARK",
  props<{mark: Mark}>()
);
export const changeMarkSuccess: ActionCreator = createAction(
  "[Change Mark Effect] CHANGE_MARK_SUCCESS",
  props<{mark: Mark}>()
);
export const changeMarkError: ActionCreator = createAction(
  "[Change Mark Effect] CHANGE_MARK_ERROR",
  props<{error: Error | string}>()
);

export const deleteMark: ActionCreator = createAction(
  "[Delete Date Column] DELETE_MARKS",
  props<{subject: ISubject, timestamp: number, needToDelete: string[]}>()
);
export const deleteMarksSuccess: ActionCreator = createAction(
  "[Delete Marks Effect] DELETE_MARKS_SUCCESS",
);
export const deleteMarksError: ActionCreator = createAction(
  "[Delete Marks Effect] DELETE_MARKS_ERROR",
  props<{error: Error | string}>()
);
