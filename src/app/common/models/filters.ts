import {_allTrue} from "../helpers/lib";
import {ISubject} from "./ISubject";

export class Equalities {
  public static Marks = (comparation: any) => _allTrue(
    ({student}) => student === comparation.student,
    ({subject}) => subject === comparation.subject,
    ({time}) => time === comparation.time,
  )

  public static Students = (comparation: any) => _allTrue(
    ({name}) => name === comparation.name,
    ({surname}) => surname === comparation.surname
  )
  public static DeleteTimestamp = (timestamp: number, subj: ISubject) => _allTrue(
    ({time}) => time === timestamp,
    ({subject}) => subject === subj.id
  )
  public static Timestamp = (timestamp: number) => _allTrue(date => date !== timestamp)
}
