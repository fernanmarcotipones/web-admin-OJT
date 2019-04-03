export class UserProfile {
  public objectId;
  public lastName = '';
  public firstName = '';
  public middleName = '';
  public occupation = '';
  public mobileNumber = '';

  constructor(data?: object) {
    if (data) { this.assign(data); }
  }

  public assign(props: Object) {
    Object.keys(this).forEach(key => this[key] = props[key]);
  }
}
