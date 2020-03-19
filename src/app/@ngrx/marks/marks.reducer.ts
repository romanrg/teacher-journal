import {Action, ActionReducer, createReducer, on} from "@ngrx/store";
import {initialMarksState, MarksState} from "./marks.state";
import * as MarksActions from "./marks.actions";
import {IStudent, StudentModel} from "../../common/models/IStudent";

const reducer: ActionReducer = createReducer(
  initialMarksState,
  on(MarksActions.getMarks, state => {
    console.log("GET_MARKS action being handled");
    return {
      ...state,
      loading: true,
      loaded: false
    };
  }),
  on(MarksActions.getMarksSuccess, (state, { marks }) => {
    console.log("GET_STUDENTS_SUCCESS action being handled");
    const data: Mark[] = [...marks];
    return {
      ...state,
      data,
      loading: false,
      loaded: true
    };
  }),
  on(MarksActions.getMarksError, (state, { error }) => {
    console.log("GET_STUDENTS_ERROR action being handled");
    return {
      ...state,
      loading: false,
      loaded: false,
      error
    };
  }),
  on(MarksActions.addNewMark, (state, {mark}) => {
    console.log("ADD_NEW_MARK action being handled");
    const newData: Mark[] = [...state.data];
    newData.push(mark);
    return {
      ...state,
      data: newData,
    };
  }),
  on(MarksActions.addNewMarkSuccess, (state, {mark}) => {
    console.log("ADD_NEW_MARK_SUCCESS action being handled");
    const newData = [...state.data].filter(m => m.id);
    newData.push(mark);
    return {
      ...state,
      data: newData
    };
  }),
  on(MarksActions.addNewMarkError, (state, {error}) => {
  console.log("ADD_NEW_MARK_ERROR action being handled", error);
  return {
    ...state
  };
}),
  on(MarksActions.changeMark, (state, {mark}) => {
    console.log("CHANGE_MARK action being handled", mark);
    const newData: Mark[] = JSON.parse(JSON.stringify(state.data));
    console.log(newData.filter(m => m.id === mark.id)[0]);
    newData.filter(m => m.id === mark.id)[0].value = mark.value;
    console.log(newData.filter(m => m.id === mark.id)[0]);
    return {
      ...state,
      data: newData
    };
  }),
  on(MarksActions.changeMarkSuccess, (state, {mark}) => {
    console.log("CHANGE_MARK_SUCCESS action being handled");
    const newData: Mark[] = JSON.parse(JSON.stringify(state.data));
    newData.filter(data => data.id === mark.id)[0].value = mark.value;
    return {
      ...state,
      data: newData
    };
  }),
  on(MarksActions.changeMarkError, (state, {error}) => {
    console.log("CHANGE_MARK_ERROR action being handled", mark);
    return {
      ...state,
      error
    };
  })
);
export function marksReducer(state: MarksState | undefined, action: Action): any {
  return reducer(state, action);
}
