import { Component, OnInit, Input } from '@angular/core';
import { ValueTransformer } from '@angular/compiler/src/util';

@Component({
  selector: 'app-admin-form-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss'],
})
export class ManagementComponent implements OnInit {

  formSourceId: string;

  setSource(value){
    this.formSourceId = value
    return this.formSourceId
  }
  constructor() {
  console.log()
   }

  ngOnInit() {
  }

}
