import {ISubject} from "../../common/models/ISubject";
import {Mark} from "../../common/models/IMark";
export namespace Subjects {
  export class Get {
    public static readonly type = "[Subjects (App)] Fetch";
  }
  export class GetError {
    public static readonly type = "[Subjects API] Fetch Error";
    constructor(public payload: Error | string){}
  }
  export class Delete {
    public static readonly type = "[Subjects List] Delete";
    constructor(public payload: string) {}
  }
  export class DeleteError {
    public static readonly type = "[Subjects API] Delete Error";
    constructor(public payload: Error | string){}
  }
  export class Create {
    public static readonly type = "[Subjects Form] Create";
    constructor(public payload: ISubject) {}
  }
  export class CreateError {
    public static readonly type = "[Subjects API] Create Error";
    constructor(public payload: Error | string){}
  }
  export class ChangePagination {
    public static readonly type = "[Subjects Table] Change Pagination";
    constructor(public payload: number){}
  }
  export class ChangeCurrentPage {
    public static readonly type = "[Subjects Table] Change Current Page";
    constructor(public payload: number){}
  }
  export class AddDate {
    public static readonly type = "[Subjects Table] Add New Date";
    constructor(public  payload: ISubject){}
  }
  export class DeleteDate {
    public static readonly type = "[Subject Table] Delete Date";
    constructor(public subject: ISubject, public marks: Mark[]) {}
  }
  export class ChangeTeacher {
    public static readonly type = "[Subject Table] Change Teacher";
    constructor(public  payload: ISubject){}
  }
  export class Patch {
    public static readonly type = "[Subjects State] Patch Subject";
    constructor(public  payload: ISubject){}
  }
  export class PatchError {
    public static readonly type = "[Subjects State] Patch Subject Error";
    constructor(public  payload: (string | Error)){}
  }
  export class SetSortedColumn {
    public static readonly type = "[Subjects Table] Set Sorted Column Number";
    constructor(public payload: number) {}
  }
  export class GetSortingMap {
    public static readonly type = "[Students State] Get Sorting Map";
    constructor(public payload: {[string]: number}[]) {}
  }
  export class PostSnapshot {
    public static readonly type = "[Subjects Table] Post SnapShot";
    constructor(public payload: any) {}
  }
  export class Update {
    public static readonly type = "[Subject Table (App)] Update Subject State";
    constructor(public  payload: ISubject) {}
  }
  export class Submit {
    public static readonly type = "[Subject Table] Submit Subject Changes";
  }

}
