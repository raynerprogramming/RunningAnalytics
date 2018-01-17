import { Component, OnInit, OnChanges, SimpleChanges, SimpleChange, Input, AfterViewChecked } from '@angular/core';
import { StorageService } from '../storage.service';
import { CalculationsService } from '../calculations.service';
import { RunGoal } from '../run-goal';

declare var Materialize: any;

@Component({
  selector: 'app-goals-input',
  templateUrl: './goals-input.component.html',
  styleUrls: ['./goals-input.component.css']
})
export class GoalsInputComponent implements OnChanges, AfterViewChecked {
  @Input() goal: RunGoal;
  minutes: number;
  hours: number;
  seconds: number;
  constructor(private storage: StorageService, private runCalc: CalculationsService) { }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    let msg: string[] = [];
    this.applyChanges(changes.currentValue);
    for (let propName in changes) {

      let changedProp = changes[propName];
      let to = JSON.stringify(changedProp.currentValue);
      if (changedProp.isFirstChange()) {
        msg.push(`Initial value of ${propName} set to ${to}`);
      } else {
        let from = JSON.stringify(changedProp.previousValue);
        msg.push(`${propName} changed from ${from} to ${to}`);
      }
    }
  }
  ngAfterViewChecked() {
    Materialize.updateTextFields();
  }
  add(goal) {
    if (goal._id) {
      this.storage.updateRunGoal(goal);
      this.goal = new RunGoal();
      this.hours = 0;
      this.minutes= 0;
      this.seconds = 0;
    } else {
      this.storage.createRunGoal(goal);
    }
  }
  applyChanges(goal) {
    if (this.goal && this.goal.duration) {
      this.hours = Math.floor(this.goal.duration / 3600)
      this.minutes = Math.floor(this.goal.duration % 3600 / 60)
      this.seconds = this.goal.duration % 60
    }
  }
  updateDuration($event) {
    this.goal.duration = this.runCalc.Duration(this.hours,this.minutes,this.seconds);
  }

  

}
