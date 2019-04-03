export class DynamicFormControlBase<T> {
  order: number;
  value: T;
  id: string;
  title: string;
  isRequired: boolean;
  index: number;
  type: string;
  helpText: string;
  controlType: string;
  toWhom: string;
  initialValue: string;
  correctAnswer: any;
  dataType: string;
  fieldId: string;
  formulaType: string;
  option: any;
  isHidden: boolean;
  choicesPoints: any;
  choicesOption: any;
  constructor(options: {
      order?: number,
      value?: T,
      id?: string,
      title?: string,
      helpText?: string,
      controlType?: string,
      toWhom?: string,
      isRequired?: boolean,
      index?: number,
      type?: string,
      initialValue?: string,
      correctAnswer?: any,
      dataType?: string,
      fieldId?: string,
      formulaType?: string,
      option?: any,
      isHidden?: boolean,
      choicesPoints?: any,
      choicesOption?: any,
  } = {}) {
    this.order = options.order;
    this.value = options.value;
    this.id = options.id || '';
    this.title = options.title || '';
    this.helpText = options.helpText || '';
    this.controlType = options.controlType || '';
    this.toWhom = options.toWhom || '';
    this.isRequired = !!options.isRequired;
    this.index = options.index === undefined ? 1 : options.index;
    this.type = options.type || '';
    this.correctAnswer = options.correctAnswer;
    this.dataType = options.dataType;
    this.fieldId = options.fieldId || '';
    this.formulaType = options.formulaType;
    this.option = options.option;
    this.isHidden = options.isHidden;
    this.choicesPoints = options.choicesPoints;
    this.choicesOption = options.choicesOption;
  }
}
