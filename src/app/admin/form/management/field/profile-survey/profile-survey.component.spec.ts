import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSurveyComponent } from './profile-survey.component';

describe('ProfileSurveyComponent', () => {
  let component: ProfileSurveyComponent;
  let fixture: ComponentFixture<ProfileSurveyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileSurveyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
