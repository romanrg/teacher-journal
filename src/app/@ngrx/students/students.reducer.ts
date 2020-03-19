import {Action, ActionReducer, createReducer, on} from "@ngrx/store";
import { StudentsState, initialStudentsState} from "./students.state";
import * as StudentsActions from "./students.actions";
import {IStudent, StudentModel} from "../../common/models/IStudent";

const reducer: ActionReducer = createReducer(
  initialStudentsState,
  on(StudentsActions.getStudents, state => {
    console.log("GET_STUDENTS action being handled");
    return {
      ...state,
      loading: true
    };
  }),
  on(StudentsActions.getStudentsSuccess, (state, { students }) => {
    console.log("GET_STUDENTS_SUCCESS action being handled");
    const data: IStudent[] = [...students];
    return {
      ...state,
      data,
      loading: false,
      loaded: true
    };
  }),
  on(StudentsActions.getStudentsError, (state, { error }) => {
    console.log("GET_STUDENTS_ERROR action being handled");
    return {
      ...state,
      loading: false,
      loaded: false,
      error
    };
  }),
  on(StudentsActions.createStudent, (state, {student}) => {
    console.log("CREATE_STUDENT action being handled", student);
    return {...state, loading: true};
  }),
  on(StudentsActions.createStudentSuccess, (state, {student}) => {
    console.log("CREATE_STUDENT_SUCCESS action being handled", student);
    const newState: StudentsState = {...state};
    newState.data = [...state.data];
    newState.data.push(student);
    console.log(state, newState)
    return {
      ...newState,
      loading: false,
      loaded: true,
    };
  }),
  on(StudentsActions.createStudentError, (state, error) => {
    console.log("CREATE_STUDENT action being handled");
    const newStudent: StudentModel = new StudentModel(
      student.name,
      student.surname,
      student.address,
      student.description
    );
    const newState: StudentsState = {
      data: [...state.data]
    };
    newState.data.push(newStudent);
    return {...newState};
  }),
  on(StudentsActions.deleteStudent, (state, { id } ) => {
    console.log("DELETE_STUDENT action being handled");
    return {...state, loading: true};
  }),
  on(StudentsActions.deleteStudentSuccess, (state, {id} ) => {
    console.log("DELETE_STUDENT_SUCCESS action being handled");
    let newState: StudentsState = {
      data: [...state.data].filter(student => student.id !== id),
      searchedStudents: null,
      loading: false,
      loaded: true,
    };
    console.log(state, newState);
    if (state.searchedStudents !== null) {
      newState.searchedStudents = [...state.searchedStudents].filter(student => student.id !== id);
    }
    return {...newState};
  }),
  on(StudentsActions.deleteStudentError, (state, {error} ) => {
    console.log("DELETE_STUDENT_ERROR action being handled");
    return {
      ...state,
      loading: false,
      loaded: false,
      error
    };
  }),
  on(StudentsActions.searchStudentsBar, ((state, {searchString}) => {
    console.log("STUDENT_SEARCH_BAR action being handled");
    return {
      ...state
    };
  })),
  on(StudentsActions.searchStudentsBarSuccess, ((state, {students}) => {
    console.log("STUDENT_SEARCH_BAR_SUCCESS action being handled");
    return {
      ...state,
      searchedStudents: students
    };
  }))
);
export function studentsReducer(state: StudentsState | undefined, action: Action): any {
  return reducer(state, action);
}
