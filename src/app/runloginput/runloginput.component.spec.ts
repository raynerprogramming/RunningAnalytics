import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunloginputComponent } from './runloginput.component';

describe('RunloginputComponent', () => {
  let component: RunloginputComponent;
  let fixture: ComponentFixture<RunloginputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunloginputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunloginputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
