export class ReporterForm {
    public objectId: string = '';
    public title: string = '';
    public description: string = '';
    public source: string = '';
    public program: any = new Object();
    public questionType: string = '';
    public isDefault: boolean = true;
    public projects: any = new Array;
    public fields: any = new Object();
    public status = '';
    public projectStatus: any = new Object();
    public programStatus: any = new Object();
  
    constructor(data?: object) {
      if (data) { this.assign(data); }
    }
  
    public cleanDataBeforeSave() {
      Object.keys(this).forEach(key => {
        this[key] = !this.isEmpty(this[key]) ? this[key] : undefined;
      });
    }
  
    private isEmpty(value) {
      if (value instanceof Object) {
        for (let key in value) {
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
  
    public assign(props: Object) {
      Object.keys(this).forEach(key => this[key] = props[key]);
    }
  }
  
