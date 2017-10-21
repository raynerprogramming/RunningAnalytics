import { Component, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { StorageService } from '../storage.service';
import { RunTag } from '../run-tag';
import { RunLog } from '../run-log';

@Component({
  selector: 'app-runloginput',
  templateUrl: './runloginput.component.html',
  styleUrls: ['./runloginput.component.css']
})
export class RunloginputComponent implements OnChanges {
  @Input() log: RunLog;
  @Input() tags: RunTag[];
  newTag: RunTag = new RunTag();
  minutes: number;
  hours: number;
  seconds: number;
  selectedTag: RunTag;
  constructor(private storage: StorageService) {
    
  }

  add(log) {
    if (log._id) {
      this.storage.updateRunLog(log);
      this.log = new RunLog();
    } else {
      this.storage.createRunLog(log);
    }
  }
  createTag(name) {
    this.storage.createRunTag(this.newTag);
  }
  assignTag() {
    var index = this.log.tags.indexOf(this.selectedTag);
    if (index < 0) {
      this.log.tags.push(this.selectedTag);
    }
  }
  removeTag(tag) {
    var index = this.log.tags.indexOf(tag);
    if (index > 0) {
      this.log.tags.splice(index, 1);
    }
  }
  selectTag($event) {
    this.selectedTag = this.tags.filter(function (obj) { return obj.name == $event.target.value })[0];
  }
  updateDuration($event) {    
  //  if (+this.minutes < 60 && +this.minutes >= 0 && +this.seconds < 60 && +this.seconds > 0)
     // this.log.duration = +this.hours*3600 + +this.minutes * 60 + +this.seconds * 60
  }
  applyChanges(log){
    if(+this.log.duration<1){
      this.log.duration=Math.ceil(+this.log.duration*3600)
      this.add(this.log);
    }
    if (this.log && this.log.duration) {
      this.hours = Math.floor(this.log.duration/3600)
      this.minutes = Math.floor(this.log.duration % 3600 / 60)
      this.seconds = this.log.duration % 60
    }
  }
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
}
