import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunCompareComponent } from './run-compare.component';

describe('RunCompareComponent', () => {
  let component: RunCompareComponent;
  let fixture: ComponentFixture<RunCompareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunCompareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
