import { Component,Input, OnInit } from '@angular/core';
import { RunLog } from '../run-log'

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit {
  @Input() log: RunLog;
  constructor() { }

  ngOnInit() {
  }
}
