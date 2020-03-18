import {ActionCreator, createAction, props} from "@ngrx/store";
import { ISubject } from "../../common/models/IStudent";

export const getSubjects: ActionCreator = createAction(
  "[Subjects List Page] GET_SUBJECTS"
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
