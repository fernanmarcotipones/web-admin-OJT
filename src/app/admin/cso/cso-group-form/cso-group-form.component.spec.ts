import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CsoGroupFormComponent } from './cso-group-form.component';

describe('CsoGroupFormComponent', () => {
  let component: CsoGroupFormComponent;
  let fixture: ComponentFixture<CsoGroupFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CsoGroupFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsoGroupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
