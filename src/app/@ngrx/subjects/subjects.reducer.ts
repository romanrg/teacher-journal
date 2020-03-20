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
    const newState: SubjectsState = {...state};
    newState.data = [...state.data];
    newState.data.push(subject);
    console.log(newState);
    return {
      ...newState,
      loading: false,
      loaded: true,
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
}),
  on(SubjectsActions.deleteSubject, ((state, {subject}) => {
    console.log("DELETE_SUBJECT action being handled");
    return {
      ...state,
      loading: true,
      loaded: false,
    };
  })),
  on(SubjectsActions.deleteSubjectSuccess, ((state, {subject}) => {
    console.log("DELETE_SUBJECT_SUCCESS action being handled");
    const newState: SubjectsState = {...state};
    newState.data = [...state.data].filter(subj => subj.id !== subject);
    newState.loading = false;
    newState.loaded = true;
    return {
      ...newState,
    }
  })),
  on(SubjectsActions.deleteSubjectError, ((state, {error}) => {
    console.log("DELETE_SUBJECT_ERROR action being handled");
    return {
      ...state,
      error,
      loaded: false,
      loading: false
    }
  })),
  on(SubjectsActions.changeTeacher, (state, {patchedSubject}) => {
    console.log("CHANGE_TEACHER action being handled", patchedSubject);
    return {
      ...state,
      loading: true,
      loaded: false,
    };
  }),
  on(SubjectsActions.changeTeacherSuccess, (state, {patchedSubject}) => {
    console.log("CHANGE_TEACHER_SUCCESS action being handled");
    const newState: SubjectsState = JSON.parse(JSON.stringify(state));
    newState.data.filter(subj => subj.id === patchedSubject.id)[0].teacher = patchedSubject.teacher;
    return {
      ...newState,
      loading: false,
      loaded: true,
    };
  }),
  on(SubjectsActions.addNewUniqueDate, (state, { subject }) => {
    console.log("ADD_NEW_UniqueDate action being handled");
    const newState: SubjectsState = JSON.parse(JSON.stringify(state));
    newState.data.filter(subj => subj.id === subject.id)[0].uniqueDates = subject.uniqueDates;
    return {
      ...newState,
    }
  }),
  on(SubjectsActions.addNewUniqueDateSuccess, (state, { subject }) => {
    console.log("ADD_NEW_UniqueDate_SUCCESS action being handled");
    const newState: SubjectsState = JSON.parse(JSON.stringify(state));
    newState.data.filter(subj => subj.id === subject.id)[0].uniqueDates = subject.uniqueDates;
    return {
      ...newState,
    };
  }),
  on(SubjectsActions.deleteDate, ((state, {timestamp, subject}) => {
    console.log("DELETE_DATE action being handled");
    const newData: ISubject[] = JSON.parse(JSON.stringify(state.data));
    const newSub: ISubject = newData.filter(sub => sub.id === subject.id)[0];
    newSub.uniqueDates = newSub.uniqueDates.filter(ts => ts !== timestamp);
    return {
      ...state,
      data: newData
    };
  })),
  on(SubjectsActions.deleteDateSuccess, ((state, {timestamp, subject}) => {
    console.log("DELETE_DATE_SUCCESS action being handled");
    return {
      ...state,
    };
  }))
);


export function subjectsReducer(state: SubjectsState | undefined, action: Action): any {
  return reducer(state, action);
}
