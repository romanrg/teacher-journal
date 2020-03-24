import {Action, ActionReducer, createReducer, on} from "@ngrx/store";
import { StudentsState, initialStudentsState} from "./students.state";
import * as StudentsActions from "./students.actions";
import {IStudent, StudentModel} from "../../common/models/IStudent";

const reducer: ActionReducer = createReducer(
  initialStudentsState,
  on(StudentsActions.getStudents, state => {
    return {
      ...state,
      loading: true
    };
  }),
  on(StudentsActions.getStudentsSuccess, (state, { students }) => {
    const data: IStudent[] = [...students];
    return {
      ...state,
      data,
      loading: false,
      loaded: true
    };
  }),
  on(StudentsActions.getStudentsError, (state, {error}) => {
    return {
      ...state,
      loading: false,
      loaded: false,
      error
    };
  }),
  on(StudentsActions.createStudent, (state, {student}) => {
    return {...state, loading: true};
  }),
  on(StudentsActions.createStudentSuccess, (state, {student}) => {
    const newState: StudentsState = {...state};
    newState.data = [...state.data];
    newState.data.push(student);
    return {
      ...newState,
      loading: false,
      loaded: true,
    };
  }),
  on(StudentsActions.createStudentError, (state, {error}) => {
    return {
      ...state,
      error
    };
  }),
  on(StudentsActions.deleteStudent, (state, { id } ) => {
    return {...state, loading: true};
  }),
  on(StudentsActions.deleteStudentSuccess, (state, {id} ) => {
    let newState: StudentsState = {
      data: [...state.data].filter(student => student.id !== id),
      searchedStudents: null,
      loading: false,
      loaded: true,
      paginationConstant: state.paginationConstant,
      currentPage: state.currentPage,
      searchBar: state.searchBar
    };
    if (state.searchedStudents !== null) {
      newState.searchedStudents = [...state.searchedStudents].filter(student => student.id !== id);
    }
    return {...newState};
  }),
  on(StudentsActions.deleteStudentError, (state, {error} ) => {
    return {
      ...state,
      loading: false,
      loaded: false,
      error
    };
  }),
  on(StudentsActions.searchStudentsBar, ((state, {searchString}) => {
    return {
      ...state,
      searchBar: searchString
    };
  })),
  on(StudentsActions.searchStudentsBarSuccess, ((state, {students}) => {
    return {
      ...state,
      searchedStudents: students
    };
  })),
  on(StudentsActions.searchStudentsBarError, (state, {error}) => {
    return {
      ...state,
      error
    };
  }),
  on(StudentsActions.changePaginationConstant, (state, {paginationConstant}) => {
    return {
      ...state,
      paginationConstant,
      currentPage: 1
    };
  }),
  on(StudentsActions.changeCurrentPage, (state, {currentPage}) => {
    return {
      ...state,
      currentPage
    };
  }),
  on(StudentsActions.changeLanguage, (state, {language}) => {
    console.log("CHANGE_LAGUAGE_ACTION being handled", language);
    return {
      ...state
    }
  })
);
export function studentsReducer(state: StudentsState | undefined, action: Action): any {
  return reducer(state, action);
}
