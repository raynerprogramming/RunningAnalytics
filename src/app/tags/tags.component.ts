import { Component,Input, OnInit } from '@angular/core';
import { RunLog } from '../run-log'
import { RunTag } from '../run-tag'

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit {
  @Input() log: RunLog;
  @Input() removable:boolean;
  constructor() { }

  ngOnInit() {
  }

  remove(tag:RunTag){
    var index = this.log.tags.indexOf(tag);
    this.log.tags.splice(index,1);
  }
}
