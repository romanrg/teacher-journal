import {StudentsState} from "./students/students.state";
import {SubjectsState} from "./subjects/subjects.state";

export interface AppState {
  students: StudentsState;
  subjects: SubjectsState;
}
