export class UserRole {
  public objectId = '';
  // public objectId = this.objectId === '' ? this.objectId : this.objectId ;
  public name = '';
  public user: any = new Object();


  constructor(data?: object) {
    if (data) { this.assign(data); }
  }

  public assign(props: Object) {
    Object.keys(this).forEach(key => this[key] = props[key]);
  }
}
