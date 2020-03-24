import {Action, ActionReducer, createReducer, on} from "@ngrx/store";
import { SubjectsState, initialSubjectsState} from "./subjects.state";
import * as SubjectsActions from "./subjects.actions";
import { ISubject, SubjectModel } from "../../common/models/ISubject";

const reducer: ActionReducer = createReducer(
  initialSubjectsState,
  on(SubjectsActions.getSubjects, state => {
    return {
      ...state,
      loading: true,
      loaded: false
    };
  }),
  on(SubjectsActions.getSubjectsSuccess, (state, {subjects}) => {
    const data: ISubject[] = [...subjects];
    return {
      ...state,
      data,
      loaded: true,
      loading: false
    };
  }),
  on(SubjectsActions.getSubjectsError, (state, {error}) => {
  return {
    ...state,
    error,
    loaded: false,
    loading: false
  };
}),
  on(SubjectsActions.createSubject, state => {
    return {
      ...state,
      loading: true,
      loaded: false
    };
  }),
  on(SubjectsActions.createSubjectSuccess, (state, { subject }) => {
    const newState: SubjectsState = {...state};
    newState.data = [...state.data];
    newState.data.push(subject);
    return {
      ...newState,
      loading: false,
      loaded: true,
    };
  }),
  on(SubjectsActions.createSubjectError, (state, { error }) => {
  return {
    ...state,
    loading: false,
    loaded: false,
    error
  };
}),
  on(SubjectsActions.deleteSubject, ((state, {subject}) => {
    return {
      ...state,
      loading: true,
      loaded: false,
    };
  })),
  on(SubjectsActions.deleteSubjectSuccess, ((state, {subject}) => {
    const newState: SubjectsState = {...state};
    newState.data = [...state.data].filter(subj => subj.id !== subject);
    newState.loading = false;
    newState.loaded = true;
    return {
      ...newState,
    }
  })),
  on(SubjectsActions.deleteSubjectError, ((state, {error}) => {
    return {
      ...state,
      error,
      loaded: false,
      loading: false
    }
  })),
  on(SubjectsActions.changeTeacher, (state, {patchedSubject}) => {
    return {
      ...state,
      loading: true,
      loaded: false,
    };
  }),
  on(SubjectsActions.changeTeacherSuccess, (state, {patchedSubject}) => {
    const newState: SubjectsState = JSON.parse(JSON.stringify(state));
    newState.data.filter(subj => subj.id === patchedSubject.id)[0].teacher = patchedSubject.teacher;
    return {
      ...newState,
      loading: false,
      loaded: true,
    };
  }),
  on(SubjectsActions.changeTeacherError, ((state, {error}) => {
    return {
      ...state,
      error,
      loaded: false,
      loading: false
    }
  })),
  on(SubjectsActions.addNewUniqueDate, (state, { subject }) => {
    const newState: SubjectsState = JSON.parse(JSON.stringify(state));
    newState.data.filter(subj => subj.id === subject.id)[0].uniqueDates = subject.uniqueDates;
    return {
      ...newState,
    }
  }),
  on(SubjectsActions.addNewUniqueDateSuccess, (state, { subject }) => {
    const newState: SubjectsState = JSON.parse(JSON.stringify(state));
    newState.data.filter(subj => subj.id === subject.id)[0].uniqueDates = subject.uniqueDates;
    return {
      ...newState,
    };
  }),
  on(SubjectsActions.addNewUniqueDateError, ((state, {error}) => {
    return {
      ...state,
      error,
      loaded: false,
      loading: false
    };
  })),
  on(SubjectsActions.deleteDate, ((state, {timestamp, subject}) => {
    const newData: ISubject[] = JSON.parse(JSON.stringify(state.data));
    const newSub: ISubject = newData.filter(sub => sub.id === subject.id)[0];
    newSub.uniqueDates = newSub.uniqueDates.filter(ts => ts !== timestamp);
    return {
      ...state,
      data: newData,
      loading: true,
      loaded: false,
    };
  })),
  on(SubjectsActions.deleteDateSuccess, ((state, {timestamp, subject}) => {
    return {
      ...state,
      loading: false,
      loaded: true
    };
  })),
  on(SubjectsActions.deleteDateError, ((state, {error}) => {
    return {
      ...state,
      error,
      loaded: false,
      loading: false
    };
  })),
  on(SubjectsActions.changePaginationConstant, (state, {paginationConstant}) => {
    return {
      ...state,
      paginationConstant,
      currentPage: 1
    };
  }),
  on(SubjectsActions.changeCurrentPage, (state, {currentPage}) => {
    return {
      ...state,
      currentPage
    };
  })
);


export function subjectsReducer(state: SubjectsState | undefined, action: Action): any {
  return reducer(state, action);
}
