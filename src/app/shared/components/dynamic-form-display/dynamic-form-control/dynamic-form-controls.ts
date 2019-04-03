import { DynamicFormControlBase } from './dynamic-form-control-base';
import { DynamicFormControlGroup } from './dynamic-form-control-group';

export class Textfield extends DynamicFormControlBase<string> {
  controlType = 'textbox';
  type: string;
  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}

export class Datefield extends DynamicFormControlBase<string> {
  controlType = 'datefield';
  type: string;
  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}

export class Textarea extends DynamicFormControlBase<string> {
  controlType = 'textarea';
  type: string;
  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}

export class Checkbox extends DynamicFormControlBase<string> {
  controlType = 'checkbox';
  choices: [any];
  constructor(options: {} = {}) {
    super(options);
    this.choices = options['choices'] || '';
  }
}

export class CheckBoxGrid extends DynamicFormControlBase<string> {
  controlType = 'grid';
  columns: [any];
  rows: [any];
  constructor(options: {} = {}) {
    super(options);
    this.columns = options['columns'] || '';
    this.rows = options['rows'] || '';
  }
}

export class RadioGrid extends DynamicFormControlBase<string> {
  controlType = 'radio_grid';
  columns: [any];
  rows: [any];
  constructor(options: {} = {}) {
    super(options);
    this.columns = options['columns'] || '';
    this.rows = options['rows'] || '';
  }
}

export class Dropdown extends DynamicFormControlBase<string> {
  controlType = 'dropdown';
  // options: {key: string, value: string}[] = [];
  choices: [any];
  constructor(options: {} = {}) {
    super(options);
    this.choices = options['choices'] || [];
  }
}

export class Radiobutton extends DynamicFormControlBase<string> {
  controlType = 'radio';
  // labelRadio: { label: string,value:any }[] = [];
  choices: [any];
  radioVal: string;
  constructor(options: {} = {}) {
    super(options);
    this.choices = options['choices'] || '';
    this.radioVal = options['radioVal'] || '';
  }
}

export class FileUpload extends DynamicFormControlBase<string> {
  controlType = 'file';
  type: string;
  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}

export * from './dynamic-form-control-group';
export const ITEMS_MODELS = {
  textField: Textfield,
  date: Datefield,
  textArea: Textarea,
  checkBox: Checkbox,
  dropDown: Dropdown,
  radioButton: Radiobutton,
  fileUpload: FileUpload,
  checkBoxGrid: CheckBoxGrid,
  radioGrid: RadioGrid,
  group: DynamicFormControlGroup
};
