import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserExportsTableComponent } from './user-exports-table.component';

describe('UserExportsTableComponent', () => {
  let component: UserExportsTableComponent;
  let fixture: ComponentFixture<UserExportsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserExportsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserExportsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
