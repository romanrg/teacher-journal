import {ISubject} from "../../common/models/ISubject";
export namespace Subjects {
  export class Get {
    public static readonly type = "[Subjects (App)] Fetch";
  }
  export class GetError {
    public static readonly type = "[Subjects API] Fetch Error";
    constructor(public payload: Error | string){}
  }
  export class GetByName {
    public static readonly type = "[Subject list] Get By Name";
    constructor(public payload: string){}
  }
  export class Delete {
    public static readonly type = "[Subjects Table] Delete";
    constructor(public payload: string) {}
  }
  export class DeleteError {
    public static readonly type = "[Subjects API] Delete Error";
    constructor(public payload: Error | string){}
  }
  export class Create {
    public static readonly type = "[Subjects Table] Create";
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
}

