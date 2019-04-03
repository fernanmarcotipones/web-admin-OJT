import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';
import { APIService } from '../api/api.service';

@Injectable()
export class CurrentProgramConfigurationService {
  source = new BehaviorSubject({});
  configuration = this.source.asObservable();
  private hasConfig = false;

  constructor(private apiService: APIService) {
    if (!this.hasConfig) {
      this.update();
    }
  }

  public update() {
    return new Promise(async (resolve, reject) => {
      try {
        this.apiService.getCurrentProgramConfiguration().subscribe(configuration => {
          this.hasConfig = true;
          this.source.next(this.configurationToJsonFormat(configuration));
          resolve (true)
        }, (error) => {
          this.hasConfig = false;
          this.source.error(error);
          resolve (false)
        })
      } catch (error) {
        reject(error);
      }
    })
  }

  private configurationToJsonFormat(configuration) {
    const newFormat = {};
    for (let i = 0; i < configuration.length; i++) {
      const config = configuration[i].toJSON();
      newFormat[config.name] = config.value
    }
    return newFormat;
  }
}
