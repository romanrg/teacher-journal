import {Store} from "@ngxs/store";
import {__filter, _chain, _compose, _partial, _pluck} from "../helpers/lib";
import {ISubject} from "../models/ISubject";
import {Mark} from "../models/IMark";
import {IStudent} from "../models/IStudent";

export class StatisticMapper {
  constructor(store: Store) {
    this.store = store;
  }

  public fromState = () => {
    return this.store.select(state => _chain(
      () => _compose(_partial(_pluck, "data"), _partial(_pluck, "subjects"))(state),
      () => _compose(_partial(_pluck, "data"), _partial(_pluck, "students"))(state),
      () => _compose(_partial(_pluck, "data"), _partial(_pluck, "marks"))(state)
    ));
  };

  public subjectsFromState = (subjects: ISubject[]): [ISubject, boolean, boolean] => {
    return __filter(({uniqueDates}) => uniqueDates.length > 0)(subjects).reduce((acc, subject) => {
      acc = [...acc, [subject, false, false]];
      return acc;
    }, []);
  };

  public studentsFromState = (students: IStudent[]): {[string]: IStudent} => {
    return students.reduce((acc, student) => {
      acc[student.id] = student;
      return acc;
    }, {});
  };

  public marksFromState = (subjects: [ISubject, boolean, boolean], marks: Mark[]): {[string]: Mark[]} => {
    return subjects.reduce((acc, tuple) => {
      acc[tuple[0].id] = __filter(({subject}) => tuple[0].id === subject)(marks);
      return acc;
    }, {});
  };

  public datesFromState = (
    subjects: [ISubject, boolean, boolean],
    marks: {[string]: Mark[]},
    getterForUniqueDates: (marks: Mark[]) => [number, boolean, boolean][] = this.uniqueDatesFromMarks
    ): {[string]: [number, boolean, boolean][]} => {
    return subjects.reduce((acc, subject) => {
      const id: string = subject[0].id;
      acc[id] = getterForUniqueDates(marks[id]).sort((a, b) => a[0] - b[0]);
      return acc;
    }, {});
  };

  public uniqueDatesFromMarks = (marks: Mark[]): [number, boolean, boolean][] => {
    return Array.from(new Set(marks.map(mark => _pluck("time", mark)))).reduce((acc, subject) => {
      acc = [...acc, [subject, false, false]];
      return acc;
    }, []);
  };

  public statisticForTable = (
    tuple: [ISubject, boolean, boolean],
    dates: {[string]: [number, boolean, boolean][]},
    marks: {[string]: Mark[]},
    students: {[string]: IStudent},
    selectedDatesArray?: number[]
  ): string[] => {
    return dates[tuple[0].id].reduce((row, dateTuple) => {
      if (!selectedDatesArray || selectedDatesArray.includes(dateTuple[0])) {
        const thatDateMarks: Mark[] = __filter((mark) => mark.time === dateTuple[0])(marks[tuple[0].id]);
        row = [...row, this.fromMarksToRow(thatDateMarks, students)];
        return row;
      }
      return row;
    },[]);
  };

  public fromStudentToName = (student: IStudent): string => `${student.name} ${student.surname}`;

  public fromMarksToRow = (marks: Mark[], students: {[string]: IStudent}) => {
      return marks.reduce((acc, mark) => {
        acc = [...acc, `${this.fromStudentToName(students[mark.student])}: ${mark.value}`];
        return acc;
      },[]);
  }
}
