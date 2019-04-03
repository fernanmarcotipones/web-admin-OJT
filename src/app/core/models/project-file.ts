export class ProjectFile {
    public project: any = new Object();
    public user: any = new Object();
    public file: any = new Object();
  
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
  