export class Region {
  public objectId: string = '';
  public name: string = '';
  public description: string = '';
  public psgcCode: string = '';
  public regionCode: string = '';
  public location: any = new Object();
  public geoCode: any = new Object();

  constructor(data?: object) {
    if (data) { this.assign(data); }
  }

  public assign(props: Object) {
    Object.keys(this).forEach(key => this[key] = props[key]);
  }
}
