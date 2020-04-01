export namespace Marks {
  export class Get {
    public static readonly type = "[Marks (App)] Fetch"
  }
  export class GetError {
    public static readonly type = "[Marks API] Fetch Error";
    constructor(public payload: Error | string){}
  }
  export class Create {
    public static readonly type = "[Subject Table > Mark Input] Create";
    constructor(public payload: Mark) {}
  }
  export class CreateError {
    public static readonly type = "[Marks API] Create Error";
    constructor(public payload: Error | string){}
  }
  export class Change {
    public static readonly type = "[Subjects Table > Mark Input] Change";
    constructor(public payload: Mark) {}
  }
  export class Patch {
    public static readonly type = "[Marks State] Patch";
    constructor(public payload: Mark) {}
  }
  export class PatchError {
    public static readonly type = "[Marks State] Patch Error";
    constructor( public payload: string|Error)
  }
  export class Delete {
    public static readonly type = "[Marks State] Delete";
    constructor( public payload: Mark) {}
  }
  export class DeleteError {
    public static readonly type = "[Marks State] Delete Error";
    constructor( public payload: string|Error) {}
  }
  export class AddToTheHashTable {
    public static readonly type = "[Subject Table (App)] Add To the Hash";
    constructor( public payload: Mark) {}
  }
  export class RemoveFromTheHashTable {
    public static readonly type = "[Subject Table] Remove From Hash";
    constructor( public payload: Mark) {}
  }
  export class ReplaceInTheHashTable {
    public static readonly type = "[Subject Table (App)] Replace In the Hashtable";
    constructor( public payload: Mark) {}
  }
  export class Submit {
    public static readonly type = "[Subject Table (App)] Submit Marks";
  }
  export class SubmitError {
    public static readonly type = "[Marks Api] Submit Error";
    constructor( public payload: string|Error) {}
  }
}
