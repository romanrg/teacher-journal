import { State, Action, StateContext, Selector} from "@ngxs/store";
import {IStudent} from "../../common/models/IStudent";
import {Statistics} from "./statistics.actions";
import {Injectable} from "@angular/core";
import {ISubject} from "../../common/models/ISubject";
import {StatisticMapper} from "../../common/dataMapper/statistic.mapper";
import * as Ngxs from "@ngxs/store";
import {patch} from "@ngxs/store/operators";
import {Mark} from "../../common/models/IMark";

enum selectorType {
  date = "date",
  month = "month",
  week = "week"
}

export class StatisticsStateModel {
  public readonly students: {[prop: string]: IStudent[]};
  public dates: [number, boolean, boolean][];
  public subjects: [ISubject, boolean, boolean][];
  public marks: {[prop: string]: Mark[]};
  public selectorType: selectorType;
}

@State<StatisticsStateModel>({
  name: "statistics",
  defaults: {
    students: {},
    dates: [],
    subjects: [],
    marks: {},
    selectorType: selectorType.date
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
  public setSubjects({setState}: StateContext<StatisticsStateModel>, {payload}: any): void {
    const mapper: StatisticMapper = new StatisticMapper();
    setState(patch({subjects: mapper.subjectsFromState(payload)}));
  }
  @Action(Statistics.SetMarks)
  public setMarks({getState, setState, dispatch}: StateContext<StatisticsStateModel>, {payload}: any): void {
    const mapper: StatisticMapper = new StatisticMapper();
    setState(patch({marks: mapper.marksFromState(getState().subjects, payload)}));
    dispatch(new Statistics.SetDates({subjects: getState().subjects, marks: getState().marks}));
  }
  @Action(Statistics.SetStudents)
  public setStudents({setState}: StateContext<StatisticsStateModel>, {payload}: any): void {
    const mapper: StatisticMapper = new StatisticMapper();
    setState(patch({students: mapper.studentsFromState(payload)}));
  }
  @Action(Statistics.SetDates)
  public setDates({setState}: StateContext<StatisticsStateModel>, {payload}: any): void {
    const mapper: StatisticMapper = new StatisticMapper();
    const {subjects, marks} = payload;
    setState(patch({dates: mapper.datesFromState(subjects, marks)}));
  }

  @Action(Statistics.ChangeSelector)
  public changeSelector({setState}: StateContext<StateModel>, {payload}: any): void {
    setState(patch({selectorType: selectorType[payload]}));
  }

}

