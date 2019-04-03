export class User{
  public objectId = this.objectId === '' ? this.objectId : this.objectId ;
  public isVerified = false;
  public isActivated = false;
  public username = '';
  public email = '';
  public userProfile: any = new Object();

  constructor(data?: object) {
    if (data) { this.assign(data); }
  }

  public assign(props: Object) {
    Object.keys(this).forEach(key => this[key] = props[key]);
  }
}
