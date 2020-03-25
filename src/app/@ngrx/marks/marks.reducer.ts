import {Action, ActionReducer, createReducer, on} from "@ngrx/store";
import {initialMarksState, MarksState} from "./marks.state";
import * as MarksActions from "./marks.actions";

const reducer: ActionReducer = createReducer(
  initialMarksState,
  on(MarksActions.getMarks, state => {
    return {
      ...state,
      loading: true,
      loaded: false
    };
  }),
  on(MarksActions.getMarksSuccess, (state, { marks }) => {
    const data: Mark[] = [...marks];
    return {
      ...state,
      data,
      loading: false,
      loaded: true
    };
  }),
  on(MarksActions.getMarksError, (state, { error }) => {
    return {
      ...state,
      loading: false,
      loaded: false,
      error
    };
  }),
  on(MarksActions.addNewMark, (state, {mark}) => {
    const newData: Mark[] = [...state.data];
    newData.push(mark);
    return {
      ...state,
      data: newData
    };
  }),
  on(MarksActions.addNewMarkSuccess, (state, {mark}) => {
    const newData = [...state.data].filter(m => m.id);
    newData.push(mark);
    return {
      ...state,
      data: newData
    };
  }),
  on(MarksActions.addNewMarkError, (state, {error}) => {
  console.log("ADD_NEW_MARK_ERROR action being handled");
  return {
    ...state,
    error
  };
}),
  on(MarksActions.changeMark, (state, {mark}) => {
    const newData: Mark[] = JSON.parse(JSON.stringify(state.data));
    newData.filter(m => m.id === mark.id)[0].value = mark.value;
    return {
      ...state,
      data: newData
    };
  }),
  on(MarksActions.changeMarkSuccess, (state, {mark}) => {
    const newData: Mark[] = JSON.parse(JSON.stringify(state.data));
    newData.filter(data => data.id === mark.id)[0].value = mark.value;
    return {
      ...state,
      data: newData
    };
  }),
  on(MarksActions.changeMarkError, (state, {error}) => {
    return {
      ...state,
      error
    };
  }),
  on(MarksActions.deleteMark, (state, {needToDelete}) => {
    return {
      ...state,
      data: [...state.data.filter(m => m.id !== needToDelete.id)]
    }
  }),
  on(MarksActions.deleteMarksSuccess, (state) => {
    return {
      ...state
    }
  }),
  on(MarksActions.deleteMarksError, (state, {error}) => {
    return {
      ...state,
      error
    };
  }),
);
export function marksReducer(state: MarksState | undefined, action: Action): any {
  return reducer(state, action);
}
