import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvinceTableComponent } from './table.component';

describe('TableComponent', () => {
  let component: ProvinceTableComponent;
  let fixture: ComponentFixture<ProvinceTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProvinceTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvinceTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
