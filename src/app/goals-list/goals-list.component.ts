import { Component, OnChanges, Input, SimpleChange, Output, EventEmitter } from '@angular/core';
import { RunGoal } from '../run-goal';
import { StorageService } from '../storage.service'
import { CalculationsService } from '../calculations.service'

@Component({
  selector: 'app-goals-list',
  templateUrl: './goals-list.component.html',
  styleUrls: ['./goals-list.component.css']
})
export class GoalsListComponent implements OnChanges {
  @Input() goals: RunGoal[];
  @Input() activeGoal: RunGoal;
  sortBy: string = "date";
  asc: boolean = true;

  @Output() changeSelectedGoal: EventEmitter<any> = new EventEmitter();
  constructor(private storage: StorageService, private runCalc: CalculationsService) { }

  deleteGoal(id: string) {
    if (confirm("Are you sure you want to delete this record?")) {
      this.storage.deleteRunGoal(id);
      this.storage.getRunGoals((err, doc) => {
        this.goals = doc;
      });
    }
  }
  changeGoal(goal: RunGoal) {
    this.changeSelectedGoal.emit(goal);
  }
  changeSortBy(sortBy: string) {
    if (this.sortBy == sortBy) {
      this.asc = !this.asc;
    } else {
      this.sortBy = sortBy;
      this.asc = true;
    }
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    let log: string[] = [];
    for (let propName in changes) {
      let changedProp = changes[propName];
      let to = JSON.stringify(changedProp.currentValue);
      if (changedProp.isFirstChange()) {
        log.push(`Initial value of ${propName} set to ${to}`);
      } else {
        let from = JSON.stringify(changedProp.previousValue);
        log.push(`${propName} changed from ${from} to ${to}`);
      }
    }
  }
}
