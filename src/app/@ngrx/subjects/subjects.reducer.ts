import {Action, ActionReducer, createReducer, on} from "@ngrx/store";
import { SubjectsState, initialSubjectsState} from "./subjects.state";
import * as SubjectsActions from "./subjects.actions";
import { ISubject, SubjectModel } from "../../common/models/ISubject";

const reducer: ActionReducer = createReducer(
  initialSubjectsState,
  on(SubjectsActions.getSubjects, state => {
    console.log("GET_SUBJECT action being handled");
    return {
      ...state,
      loading: true,
      loaded: false
    };
  }),
  on(SubjectsActions.getSubjectsSuccess, (state, {subjects}) => {
    console.log("GET_SUBJECTS_SUCCESS action being handled");
    const data: ISubject[] = [...subjects];
    return {
      ...state,
      data,
      loaded: true,
      loading: false
    };
  }),
  on(SubjectsActions.getSubjectsError, (state, {error}) => {
  console.log("GET_SUBJECTS_ERROR action being handled");
  return {
    ...state,
    error,
    loaded: false,
    loading: false
  };
}),
  on(SubjectsActions.createSubject, state => {
    console.log("CREATE_SUBJECT action being handled");
    return {
      ...state,
      loading: true,
      loaded: false
    };
  }),
  on(SubjectsActions.createSubjectSuccess, (state, { subject }) => {
    console.log("CREATE_SUBJECT_SUCCESS action being handled", subject);
    return {
      ...state,
      loading: false,
      loaded: true
    };
  }),
  on(SubjectsActions.createSubjectError, (state, { error }) => {
  console.log("CREATE_SUBJECT_ERROR action being handled", error);
  return {
    ...state,
    loading: false,
    loaded: false,
    error
  };
})
);


export function subjectsReducer(state: SubjectsState | undefined, action: Action): any {
  return reducer(state, action);
}
