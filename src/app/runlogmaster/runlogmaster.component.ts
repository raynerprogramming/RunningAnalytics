import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { RunLog } from '../run-log'
import { RunTag } from '../run-tag'
import { StorageService } from '../storage.service'

@Component({
  selector: 'app-runlogmaster',
  templateUrl: './runlogmaster.component.html',
  styleUrls: ['./runlogmaster.component.css']
})
export class RunlogmasterComponent implements OnInit {
  logs: RunLog[];
  tags: RunTag[];
  log: RunLog;
  @Output() changeSelectedLog: EventEmitter<any> = new EventEmitter();
  constructor(private storage: StorageService) {
    this.log = new RunLog();
    storage.getRunTags((err, doc) => {
      this.tags = doc;
    });
    storage.getRunLogs((err, doc) => {
      this.logs = doc;
    });
  }

  changeLog($event) {
    this.log = $event;
    console.log($event);
  }
  changeLogs($event) {
    this.logs = $event;
    console.log($event);
  }
  changeTags($event) {
    this.tags = $event;
    console.log($event);
  }

  ngOnInit() {
  }

}
