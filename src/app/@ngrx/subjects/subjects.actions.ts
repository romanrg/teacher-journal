import {ActionCreator, createAction, props} from "@ngrx/store";
import { ISubject } from "../../common/models/IStudent";

export const getSubjects: ActionCreator = createAction(
  "[Main Page (App)] GET_SUBJECTS"
);
export const getSubjectsSuccess: ActionCreator = createAction(
  "[Get Subjects Effect] GET_SUBJECTS_SUCCESS",
  props<{subjects: ISubject[]}>()
);
export const getSubjectsError: ActionCreator = createAction(
  "[Get Subjects Effect] GET_SUBJECTS_ERROR",
  props<{error: Error | string}>()
);

export const createSubject: ActionCreator = createAction(
  "[Subjects Form Page] CREATE_SUBJECT",
  props<{subject: ISubject}>()
);
export const createSubjectSuccess: ActionCreator = createAction(
  "[Create Subject Effect] CREATE_SUBJECT_SUCCESS",
  props<{subject: ISubject}>()
);
export const createSubjectError: ActionCreator = createAction(
  "[Create Subject Effect] CREATE_SUBJECT_ERROR",
  props<{error: Error | string}>()
);





export const deleteSubject: ActionCreator = createAction(
  "[Subjects List Page] DELETE_SUBJECT",
  props<{subject: string}>()
);
export const deleteSubjectSuccess: ActionCreator = createAction(
  "[Delete Subject Effect] DELETE_SUBJECT_SUCCESS",
  props<{subject: string}>()
);
export const deleteSubjectError: ActionCreator = createAction(
  "[Delete Subject Effect] DELETE_SUBJECT_ERROR",
  props<{error: Error | string}>()
);


export const addCurrent: ActionCreator = createAction(
  "[Subject Table Page] ADD_CURRENT",
  props<{current: string}>()
);

export const addCurrentSuccess: ActionCreator = createAction(
  "[Add Current Subject Effect] ADD_CURRENT_SUCCESS",
  props<{subject: ISubject}>()
);


export const changeTeacher: ActionCreator = createAction(
  "[Subject Table Page] CHANGE_TEACHER",
  props<{patchedSubject: ISubject}>()
);
// changeTeacherSuccess

export const changeTeacherSuccess: ActionCreator = createAction(
  "[Change Teacher Effect] CHANGE_TEACHER_SUCCESS",
  props<{patchedSubject: ISubject}>()
);

export const changeTeacherError: ActionCreator = createAction(
  "[Change Teacher Effect] CHANGE_TEACHER_ERROR",
  props<{error: Error | string}>()
);


export const addNewUniqueDate: ActionCreator = createAction(
  "[New Date Column Form] ADD_NEW_UniqueDate",
  props<{subject: ISubject}>()
);

export const addNewUniqueDateSuccess: ActionCreator = createAction(
  "[Add new UniqueDate Effect] ADD_NEW_UniqueDate_Success",
  props<{timestamp: number, subject: ISubject}>()
);
export const addNewUniqueDateError: ActionCreator = createAction(
  "[Add new UniqueDate Effect] ADD_NEW_UniqueDate_ERROR",
  props<{error: Error | string}>()
);


export const deleteDate: ActionCreator = createAction(
  "[Subjects List Page] DELETE_DATE",
  props<{subject: ISubject, timestamp: number}>()
);
export const deleteDateSuccess: ActionCreator = createAction(
  "[Delete Subject Effect] DELETE_DATE_SUCCESS",
  props<{subject: string}>()
);
export const deleteDateError: ActionCreator = createAction(
  "[Delete Subject Effect] DELETE_DATE_ERROR",
  props<{error: Error | string}>()
);
export const changePaginationConstant: ActionCreator = createAction(
  "[Subjects table page] CHANGE_PAGINATION",
  props<{paginationConstant: number}>()
);

export const changeCurrentPage: ActionCreator = createAction(
  "[Subjects table page] CHANGE_CURRENT_PAGE",
  props<{currentPage: number}>()
);
