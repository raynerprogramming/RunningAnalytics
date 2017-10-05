import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunLogItemComponent } from './run-log-item.component';

describe('RunLogItemComponent', () => {
  let component: RunLogItemComponent;
  let fixture: ComponentFixture<RunLogItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunLogItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunLogItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
