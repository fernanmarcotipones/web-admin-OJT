import { Injectable } from '@angular/core';

@Injectable()
export class DateService {
  getYears() {
    const start = new Date('January 1, 2010');
    const end = new Date();
    const yearsBetween = [];
    for ( let year = start.getFullYear(); year <= end.getFullYear(); year++ ) {
        yearsBetween.push(year);
    }

    return yearsBetween;
  }
}
