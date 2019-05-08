import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAboutFormComponent } from './user-about-form.component';

describe('UserAboutFormComponent', () => {
  let component: UserAboutFormComponent;
  let fixture: ComponentFixture<UserAboutFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAboutFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAboutFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
