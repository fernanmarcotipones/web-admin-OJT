import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CsoComponent } from './cso.component';

describe('CsoComponent', () => {
  let component: CsoComponent;
  let fixture: ComponentFixture<CsoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CsoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
