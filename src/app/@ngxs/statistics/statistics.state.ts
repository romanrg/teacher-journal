import { State, Action, StateContext, Selector} from "@ngxs/store";
import {IStudent} from "../../common/models/IStudent";
import {Statistics, Students} from "./statistics.actions";
import {StudentsServiceService} from "../../common/services/students.service";
import {catchError, retry, tap} from "rxjs/internal/operators";
import {Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import {ISubject} from "../../common/models/ISubject";
import {Mark} from "../../common/models/IMark";
import {StatisticMapper} from "../../common/dataMapper/statistic.mapper";
import * as Ngxs from "@ngxs/store";
import {NgxsStudentsState} from "../students/students.state";
import {NgxsSubjectsState} from "../subjects/subjects.state";
import {patch, updateItem} from "@ngxs/store/operators";
import set = Reflect.set;

export class StatisticsStateModel {
  public readonly students: {[string]: IStudent[]};
  public dates: [number, boolean, boolean][];
  public readonly subjects: ISubject[];
  public marks: {[string]: [number, boolean, boolean][]};
}

@State<StatisticsStateModel>({
  name: "statistics",
  defaults: {
    students: {},
    dates: [],
    subjects: [],
    marks: {}
  }
})
@Injectable({
  providedIn: "root"
})
export class NgxsStatisticsState {

  constructor(
    private store: Ngxs.Store,
  ) {
  }

  @Selector()
  public static Statistics(state: StatisticsStateModel): StatisticsStateModel {
    return state;
  }

  @Action(Statistics.Initialize)
  public initialize({getState, setState, dispatch}: StateContext<StatisticsStateModel>): void {
  }

  @Action(Statistics.SetSubjects)
  public setSubjects({getState, setState, dispatch}: StateContext<StatisticsStateModel>, {payload}: ISubject[]): void {
    const mapper: StatisticMapper = new StatisticMapper();
    setState(patch({subjects: mapper.subjectsFromState(payload)}));
  }
  @Action(Statistics.SetMarks)
  public setMarks({getState, setState, dispatch}: StateContext<StatisticsStateModel>, {payload}: ISubject[]): void {
    const mapper: StatisticMapper = new StatisticMapper();
    setState(patch({marks: mapper.marksFromState(getState().subjects, payload)}));
    dispatch(new Statistics.SetDates({subjects: getState().subjects, marks: getState().marks}));
  }
  @Action(Statistics.SetStudents)
  public setStudents({getState, setState, dispatch}: StateContext<StatisticsStateModel>, {payload}: ISubject[]): void {
    const mapper: StatisticMapper = new StatisticMapper();
    setState(patch({students: mapper.studentsFromState(payload)}));
  }
  @Action(Statistics.SetDates)
  public setDates({getState, setState, dispatch}: StateContext<StatisticsStateModel>, {payload}: ISubject[]): void {
    const mapper: StatisticMapper = new StatisticMapper();
    const {subjects, marks} = payload;
    setState(patch({dates: mapper.datesFromState(subjects, marks)}));
  }

}

