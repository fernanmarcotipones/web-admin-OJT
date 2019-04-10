import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionTableComponent } from './table.component';

describe('TableComponent', () => {
  let component: RegionTableComponent;
  let fixture: ComponentFixture<RegionTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegionTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
