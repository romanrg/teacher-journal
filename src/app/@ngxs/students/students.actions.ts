import {IStudent} from "../../common/models/IStudent";
export namespace Students {
  export class Get {
    public static readonly type = "[Students (App)] Fetch";
  }
  export class GetError {
    public static readonly type = "[Students API] Fetch Error";
    constructor(public payload: Error | string){}
  }
  export class Delete {
    public static readonly type = "[Students Table] Delete";
    constructor(public payload: IStudent) {}
  }
  export class DeleteError {
    public static readonly type = "[Students API] Delete Error";
    constructor(public payload: Error | string){}
  }
  export class Create {
    public static readonly type = "[Students Table] Create";
    constructor(public payload: IStudent) {}
  }
  export class CreatetError {
    public static readonly type = "[Students API] Create Error";
    constructor(public payload: Error | string){}
  }
  export class Search {
    public static readonly type = "[Students Table] Search Student";
    constructor(public payload: string) {};
  }
  export class SearchError {
    public static readonly type = "[Students API] Search Student Error";
    constructor(public payload: Error | string){}
  }
  export class ChangePagination {
    public static readonly type = "[Students Table] Change Pagination";
    constructor(public payload: number){}
  }
  export class ChangeCurrentPage {
    public static readonly type = "[Students Table] Change Current Page";
    constructor(public payload: number){}
  }
}

