import {StudentsState} from "./students/students.state";
import {SubjectsState} from "./subjects/subjects.state";
import {MarksState} from "./marks/marks.state";

export interface AppState {
  students: StudentsState;
  subjects: SubjectsState;
  marks: MarksState;
}
