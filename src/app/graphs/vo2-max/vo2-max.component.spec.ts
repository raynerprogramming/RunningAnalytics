import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VO2MaxComponent } from './vo2-max.component';

describe('VO2MaxComponent', () => {
  let component: VO2MaxComponent;
  let fixture: ComponentFixture<VO2MaxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VO2MaxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VO2MaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
