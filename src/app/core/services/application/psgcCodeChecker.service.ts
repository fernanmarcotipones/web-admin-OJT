import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { APIService } from './../api/api.module';
@Injectable()
export class PsgcCodeCheckerService {

  private source = new Subject<any>();
  sourceObservable$ = this.source.asObservable().toPromise();

  constructor(private apiService: APIService) { };

  isPsgcCodeExists(className, psgcCode, exceptObjectId?): Promise<boolean> {
    let returnVal = false;
    return new Promise(async (resolve, reject) => {
      try {
        const query = new this.apiService.Query(className);
        query.equalTo('psgcCode', psgcCode);
        if (exceptObjectId !== '') {
          query.notEqualTo('objectId', exceptObjectId);
        }
        query.find().then(objects => {
          if (objects.length > 0) {
            returnVal = true;
          }
          resolve(returnVal);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  onDataChange(data: any) {
    this.source.next(data);
  }
}
