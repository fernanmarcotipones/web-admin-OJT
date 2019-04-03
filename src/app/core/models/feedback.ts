
export class Feedback {
  public objectId = '';
  public status = '';
  public points = 0;
  public user: any = new Object();
  public project: any = new Object();
  public form: any = new Object();
  public value: any = new Object();
  public location: any = new Object();
  public startDate: Date = new Date();
  public endDate: Date = new Date();
  public createdAt: Date = new Date();
  public isLocationManuallyEntered = false;

  constructor(data?: object) {
    if (data) { this.assign(data); }
  }

  public assign(props: Object) {
    Object.keys(this).forEach(key => this[key] = props[key]);
  }
}
