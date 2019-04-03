import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';

import { APIService } from '../api/api.service';

@Injectable()
export class ProgramConfigurationService {

  private className = 'ProgramConfiguration';

  constructor(private apiService: APIService) { }

  getByProgramCodeAndName(programCode, name): Promise<any> {
    let configuration: any;
    return new Promise(async(resolve, reject) => {
      try {
        const programQ = new this.apiService.Query('Program');
        programQ.equalTo('programCode', programCode);

        const query = new this.apiService.Query(this.className);
        query.equalTo('name', name);
        query.include('program');
        query.matchesQuery('program', programQ);

        const results = await query.find();
        if (results.length > 0) {
          configuration = results[0].toJSON();
        }
        resolve(configuration);
      }catch (error) {
        console.log(error);
        reject(error);
      }
    })
  }
}
