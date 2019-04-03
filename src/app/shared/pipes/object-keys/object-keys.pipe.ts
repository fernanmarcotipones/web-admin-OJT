import {Pipe, PipeTransform} from '@angular/core';

@Pipe({ name: 'ObjectKeys',  pure: false })
export class ObjectKeysPipe implements PipeTransform {
    transform(value: any, args: any[] = null): any {
        return Object.keys(value)
    }
}
