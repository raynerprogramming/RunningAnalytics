import { Component, Input, Output, OnChanges, SimpleChanges, SimpleChange, EventEmitter, AfterViewChecked } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { StorageService } from '../storage.service';
import { CalculationsService } from '../calculations.service';
import { MaterializeDirective, MaterializeAction } from "angular2-materialize";
import { RunTag } from '../run-tag';
import { RunLog } from '../run-log';
declare var Materialize: any;

@Component({
  selector: 'app-runloginput',
  templateUrl: './runloginput.component.html',
  styleUrls: ['./runloginput.component.css']
})
export class RunloginputComponent implements OnChanges, AfterViewChecked {
  @Input() log: RunLog;
  @Input() tags: RunTag[];
  logs: RunLog[];
  newTag: RunTag = new RunTag();
  minutes: number;
  hours: number;
  seconds: number;
  selectedTag: RunTag;
  modalActions1 = new EventEmitter<string | MaterializeAction>();

  @Output() updateLogsEmitter: EventEmitter<any> = new EventEmitter();
  constructor(private storage: StorageService, private runCalc: CalculationsService) {

  }
  ngAfterViewChecked() {
    Materialize.updateTextFields();
  }
  toast(text: string, duration: number = 3000, style: string = "") {
    Materialize.toast(text, duration, style);
  }
  add(log) {
    if (log._id) {
      this.storage.updateRunLog(log);
      this.log = new RunLog();
      this.hours = 0;
      this.minutes = 0;
      this.seconds = 0;
    } else {
      this.storage.createRunLog(log);      
    }    
    this.updateLogsEmitter.emit(null);
  }
  createTag(name) {
    this.storage.createRunTag(this.newTag);
  }
  deleteTag(tag) {
    this.storage.deleteRunTag(tag["_id"]);
    this.toast("Tag: " + tag.name + " deleted successfully");
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
    //this.selectedTag = this.tags.filter(function (obj) { return obj.name == $event.target.value })[0];
  }
  updateDuration($event) {
    this.log.duration = this.runCalc.Duration(this.hours, this.minutes, this.seconds);
  }
  applyChanges(log) {
    if (this.log && this.log.duration) {
      this.hours = Math.floor(this.log.duration / 3600)
      this.minutes = Math.floor(this.log.duration % 3600 / 60)
      this.seconds = this.log.duration % 60
    }
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    let msg: string[] = [];
    this.applyChanges(changes.currentValue);
    if (this.tags) {
      this.selectedTag = this.tags[0];
    }
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
