import {_allTrue} from "../helpers/lib";
import {ISubject} from "./ISubject";

export enum Equalities {
  Marks = (comparation: any) => _allTrue(
    ({student}) => student === comparation.student,
    ({subject}) => subject === comparation.subject,
    ({time}) => time === comparation.time,
  ),

  Students = (comparation: any) => _allTrue(
    ({name}) => name === comparation.name,
    ({surname}) => surname === comparation.surname
  ),
  DeleteTimestamp = (timestamp: number, subj: ISubject) => _allTrue(
    ({time}) => time === timestamp,
    ({subject}) => subject === subj.id
  ),
  Timestamp = (timestamp: number) => _allTrue(date => date !== timestamp)
}
