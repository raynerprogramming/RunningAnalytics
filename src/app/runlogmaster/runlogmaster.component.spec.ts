import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunlogmasterComponent } from './runlogmaster.component';

describe('RunlogmasterComponent', () => {
  let component: RunlogmasterComponent;
  let fixture: ComponentFixture<RunlogmasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunlogmasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunlogmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
