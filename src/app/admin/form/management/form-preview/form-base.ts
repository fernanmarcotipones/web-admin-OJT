export class FormBase {
    key: string;
    label: string;
    required: boolean;
    controlType: string;
    order: number
    constructor(options: {
        key?: string,
        label?: string,
        required?: boolean,
        controlType?: string,
        order?: number
      } = {}) {
      this.key = options.key || '';
      this.label = options.label || '';
      this.required = !!options.required;
      this.order = options.order === undefined ? 1 : options.order;
      this.controlType = options.controlType || '';
    }
  }

