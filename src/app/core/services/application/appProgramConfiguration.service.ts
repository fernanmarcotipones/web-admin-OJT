import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
@Injectable()
export class AppProgramConfigurationService {
  private source = new Subject<any>();
  sourceObservable$ = this.source.asObservable().toPromise();

  onDataChange(data: any) {
    this.source.next(data);
  }
}
