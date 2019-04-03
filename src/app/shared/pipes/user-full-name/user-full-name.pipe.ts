import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userFullName'
})
export class UserFullNamePipe implements PipeTransform {

  transform(value: any, args?: any): string {
    let fullName = '';
    if (value) {
      fullName += value.firstName ? value.firstName + ' ' : '';
      fullName += value.middleName ? value.middleName + ' ' : '';
      fullName += value.lastName ? value.lastName : '';
    }

    return fullName;
  }

}
