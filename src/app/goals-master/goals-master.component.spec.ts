import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalsMasterComponent } from './goals-master.component';

describe('GoalsMasterComponent', () => {
  let component: GoalsMasterComponent;
  let fixture: ComponentFixture<GoalsMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoalsMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoalsMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
