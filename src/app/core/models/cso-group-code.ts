export class CSOGroupCode {

  public objectId = '';
  public code = '';
  public description = '';
  public level: any = new Object();
  public program: any = new Object();
  public csoGroup: any = new Object();
  // location details
  public region: any = new Object();
  public province: any = new Object();
  public municipality: any = new Object();
  public barangay: any = new Object();

  // private apiService: APIService;

  constructor(data?: object) {
    if (data) { this.assign(data); }
  }

  public assign(props: Object) {
    Object.keys(this).forEach(key => this[key] = props[key]);
  }

  public cleanDataBeforeSave() {
    Object.keys(this).forEach(key => {
      this[key] = !this.isEmpty(this[key]) ? this[key] : undefined;
    });
  }

  private isEmpty(value) {
    if (value instanceof Object) {
      for (const key in value) {
        if (value.hasOwnProperty(key)) {
          return false;
        }
      }
    }

    if (typeof value === 'string') {
      if (value !== '') {
        return false;
      }
    }
    return true;
  }

}
