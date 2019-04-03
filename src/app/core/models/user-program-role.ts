export class UserProgramRole {
  public objectId = this.objectId === '' ? this.objectId : this.objectId ;
  public level: any = new Object();
  public program: any = new Object();
  public user: any = new Object();
  public role: any = new Object();
  public csoGroup: any = new Object();
  public region: any = new Object();
  public province: any = new Object();
  public municipality: any = new Object();
  public barangay: any = new Object();
  public district: number;
  public selected: boolean;
  public isActive: boolean;


  constructor(data?: object) {
    if (data) { this.assign(data); }
  }

  public assign(props: Object) {
    Object.keys(this).forEach(key => this[key] = props[key]);
  }
}
