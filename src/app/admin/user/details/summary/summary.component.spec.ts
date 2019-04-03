import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetailsSummaryComponent } from './summary.component';

describe('UserDetailsSummaryComponent', () => {
  let component: UserDetailsSummaryComponent;
  let fixture: ComponentFixture<UserDetailsSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserDetailsSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
