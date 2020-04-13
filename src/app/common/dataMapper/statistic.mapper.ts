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
    const columns: string[] = dates[tuple[0].id].reduce((col, dateTuple) => {
      if (!selectedDatesArray || selectedDatesArray.includes(dateTuple[0])) {
        const thatDateMarks: Mark[] = __filter((mark) => mark.time === dateTuple[0])(marks[tuple[0].id]);
        const averageMark: number = thatDateMarks.reduce((acc, m) => acc + m.value, 0) / thatDateMarks.length;
        const academicPerformance: number = thatDateMarks.filter(mark => mark.value >= 4).length / thatDateMarks.length;
        const quality: number = thatDateMarks.filter(mark => mark.value >= 7).length / thatDateMarks.length;
        const degree: number = (
          thatDateMarks.filter(mark => mark.value < 4).length * 0.16 +
          thatDateMarks.filter(mark => mark.value >= 4 && mark.value < 7).length * 0.36 +
          thatDateMarks.filter(mark => mark.value >= 7 && mark.value < 9).length * 0.64 +
          thatDateMarks.filter(mark => mark.value >= 9).length * 1
        ) / thatDateMarks.length;
        const report: string = this.generateReport(averageMark, academicPerformance, quality, degree);
        col = [...col, this.fromMarksToRow(thatDateMarks, students).concat(
          report
        )];
        return col;
      }
      return col;
    },[]);
    return columns;
  };

  public generateReport = (average: number, performance: number, quality: number, degree: number) => {
      return `Average: ${(average).toFixed(2)}\n` +
      `Academic performance: ${(performance * 100).toFixed(2)}%\n` +
      `Quality of education: ${(quality * 100).toFixed(2) }%\n` +
      `Degree of learning: ${(degree * 100).toFixed(2) }%`;
  };

  public fromStudentToName = (student: IStudent): string => `${student.name} ${student.surname}`;

  public fromMarksToRow = (marks: Mark[], students: {[string]: IStudent}) => {
      return marks.reduce((acc, mark) => {
        acc = [...acc, `${this.fromStudentToName(students[mark.student])}: ${mark.value}`];
        return acc;
      },[]);
  }
}
