import { Component, OnInit, OnChanges, SimpleChanges, SimpleChange, Input } from '@angular/core';
import { StorageService } from '../storage.service';
import { CalculationsService } from '../calculations.service';
import { RunGoal } from '../run-goal';

@Component({
  selector: 'app-goals-input',
  templateUrl: './goals-input.component.html',
  styleUrls: ['./goals-input.component.css']
})
export class GoalsInputComponent implements OnChanges {
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
  add(goal) {
    if (goal._id) {
      this.storage.updateRunGoal(goal);
      this.goal = new RunGoal();
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
    var duration: number = 0;
    if (this.isNumeric(this.hours)) {
      if (+this.hours >= 0 && +this.hours < 24) {
        duration += +this.hours * 3600;
      }
    }
    if (this.isNumeric(this.minutes)) {
      if (+this.minutes >= 0 && +this.minutes < 60) {
        duration += +this.minutes * 60;
      }
    }
    if (this.isNumeric(this.seconds)) {
      if (+this.seconds >= 0 && +this.seconds < 60) {
        duration += +this.seconds;
      }
    }
    this.goal.duration = duration;
  }

  isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

}
