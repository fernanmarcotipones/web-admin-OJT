export class Municipality {
  public objectId: string = '';
  public name: string = '';
  public psgcCode: string = '';
  public regionCode: string = '';
  public provinceCode: string = '';
  public municipalityCode: string = '';
  public region: any = new Object();
  public province: any = new Object();
  public location: any = new Object();
  public geoCode: any = new Object();

  constructor(data?: object) {
    if (data) { this.assign(data); }
  }

  public assign(props: Object) {
    Object.keys(this).forEach(key => this[key] = props[key]);
  }
}
