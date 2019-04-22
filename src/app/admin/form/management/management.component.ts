import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-form-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss']
})
export class ManagementComponent implements OnInit {
  public formPreviewThumbnail = '/assets/img/form-preview-placeholder.jpg';
  constructor() { }

  ngOnInit() {
  }

}
