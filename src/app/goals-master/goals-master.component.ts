import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { StorageService } from '../storage.service'
import { RunGoal } from '../run-goal';


@Component({
  selector: 'app-goals-master',
  templateUrl: './goals-master.component.html',
  styleUrls: ['./goals-master.component.css']
})
export class GoalsMasterComponent implements OnInit {

  goal: RunGoal;
  goals: RunGoal[];
  @Output() changeSelectedGoal: EventEmitter<any> = new EventEmitter();
  constructor(private storage: StorageService) {
    this.goal = new RunGoal();
    storage.getRunGoals((err, doc) => {
      this.goals = doc;
    });
  }

  changeGoal($event) { 
    this.goal = $event;
  }
  ngOnInit() {
  }

}
