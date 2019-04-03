export class UserCSOGroup{
  // public objectId = '';
  public user: any = new Object();
  public csoGroup: any = new Object();


  constructor(data?: object) {
    if (data) { this.assign(data); }
  }

  public assign(props: Object) {
    Object.keys(this).forEach(key => this[key] = props[key]);
  }
}
