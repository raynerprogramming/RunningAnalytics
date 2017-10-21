import { Component, OnChanges, Input, SimpleChange, Output, EventEmitter  } from '@angular/core';
import {MaterializeDirective} from 'angular2-materialize';
import { RunLog } from '../run-log'
import { RunTag } from '../run-tag'
import { StorageService } from '../storage.service'
@Component({
  selector: 'app-run-log',
  templateUrl: './run-log.component.html',
  styleUrls: ['./run-log.component.css']
})
export class RunLogComponent implements OnChanges {
  @Input() logs: RunLog[];
  @Input() activelog: RunLog;
  @Input() tags: RunTag[];
  sortBy:string = "date";


  @Output() changeSelectedLog: EventEmitter<any> = new EventEmitter();
  constructor(private storage: StorageService) {   }

   deleteLog(id:string){
     this.storage.deleteRunLog(id);
     this.storage.getRunLogs((err,doc) =>  {
      this.logs=doc;
    });
   }
   changeLog(log: RunLog) {
    this.changeSelectedLog.emit(log);
  }
  changeSortBy(sortBy:string){
    this.sortBy=sortBy;
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
