import {Action, ActionReducer, createReducer, on, props} from "@ngrx/store";

import { StudentsState, initialStudentsState} from "./students.state";
import * as StudentsActions from "./students.actions";
import {StudentModel} from "../../common/models/IStudent";

const reducer: ActionReducer = createReducer(
  initialStudentsState,
  on(StudentsActions.getStudents, state => {
    console.log("GET_STUDENTS action being handled");
    return {...state};
  }),
  on(StudentsActions.getStudent, state => {
    console.log("GET_STUDENT action being handled");
    return {...state};
  }),
  on(StudentsActions.createStudent, (state, student) => {
    console.log("CREATE_STUDENT action being handled");
    const newStudent: StudentModel = new StudentModel(
      `f${(~~(Math.random()*1e8)).toString(16)}`,
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
  on(StudentsActions.deleteStudent, (state, { id }) => {
    const newState: StudentsState = {
      data: state.data.filter(student => student.id !== id)
    };
    return {...newState};
  }),
);
export function studentsReducer(state: StudentsState | undefined, action: Action): any {
  return reducer(state, action);
}
