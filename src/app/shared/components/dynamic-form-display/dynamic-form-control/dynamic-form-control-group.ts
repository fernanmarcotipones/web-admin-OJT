import { DynamicFormControlBase } from './dynamic-form-control-base';
export class DynamicFormControlGroup extends DynamicFormControlBase<any> {
  public items: DynamicFormControlBase<any>[];
  constructor(obj: any = {}) {
    super(obj);
    this.items = obj.items || [];
  }
}
