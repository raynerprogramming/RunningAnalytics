import { Component, OnInit } from '@angular/core';
import { RunLog } from '../run-log'

@Component({
  selector: 'app-run-log-item',
  templateUrl: './run-log-item.component.html',
  styleUrls: ['./run-log-item.component.css']
})
export class RunLogItemComponent implements OnInit {
  log:RunLog;
  constructor(log:RunLog) { this.log=log; }

  ngOnInit() {
  }

}
