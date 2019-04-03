export class UserExport {
  public objectId = '';
  public user: any = new Object();
  public file: any = new Object();
  public program: any = new Object();
  public module = '';
  public createdAt: any = new Object();
  public type = '';

  constructor(data?: object) {
    if (data) { this.assign(data); }
  }

  public assign(props: Object) {
    Object.keys(this).forEach(key => this[key] = props[key]);
  }
}
