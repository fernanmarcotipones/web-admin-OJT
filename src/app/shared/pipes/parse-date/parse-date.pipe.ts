import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';
import 'moment/locale/en-gb';

@Pipe({
  name: 'parseDate'
})
export class ParseDatePipe implements PipeTransform {

  transform(value: any, format?: any): any {
    const date = value instanceof Object ? value.iso : value;
    let dateFormatted = '';
    if (date) {
      dateFormatted = moment(date).format(format);
    }
    return dateFormatted
  }

}
