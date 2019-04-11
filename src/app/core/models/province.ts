export class Province {
  public objectId = '';
  public name = '';
  public psgcCode = '';
  public regionCode = '';
  public provinceCode = '';
  public region: any = new Object();
  public location: any = new Object();
  public geoCode: any = new Object();
  public isSocialMediaProhibited: boolean = false;
  
  constructor(data?: object) {
    if (data) { this.assign(data); }
  }

  public assign(props: Object) {
    Object.keys(this).forEach(key => this[key] = props[key]);
  }
}
