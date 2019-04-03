
export class ProgramMonitoringForm {
  public objectId = '';
  public title = '';
  public code = '';
  public program: any = new Object();
  public rules: any = new Object();
  public forms: Array<any>;
  public isActive: boolean;

  constructor(data?: object) {
    if (data) { this.assign(data); }
  }

  public assign(props: Object) {
    Object.keys(this).forEach(key => this[key] = props[key]);
  }
}
