import { Injectable } from '@angular/core';
import { RunLog } from './run-log'
import { RunTag } from './run-tag'
import * as Datastore from 'nedb'

@Injectable()
export class NedbService {
  runLogdb: Datastore;
  runTagdb: Datastore;

  constructor() {
    this.runLogdb = new Datastore({ filename: 'RunLog.db', autoload: true });
    this.runTagdb = new Datastore({ filename: 'RunTag.db', autoload: true });
  }

  getRunLog(id: string): RunLog {
    return this.runLogdb.findOne({ _id: id }, function (err, doc) {
      console.log('Found RunLog: ', doc._id);
    });
  }
  getRunLogs(callback): RunLog[] {
    return this.runLogdb.find({},callback);
  }
  deleteRunLog(id: string): Boolean {
    return this.runLogdb.remove({ _id: id }, function (err, doc) {
      console.log('Removed RunLog: ', doc._id);
    });
  }
  createRunLog(log: RunLog): Boolean {
    return this.runLogdb.insert(log, function (err, doc) {
      console.log('Add RunLog: ', doc._id);
    });
  }
  updateRunLog(log: RunLog): Boolean {
    return this.runLogdb.update(log, function (err, doc) {
      console.log('Removed RunLog: ', doc._id);
    });
  }

  createRunTag(tag: RunTag){
    return this.runTagdb.insert(tag,function(err,doc){
      console.log('Add RunTag: ', doc._id);
    })
  }
  getRunTag(id: string){
    return this.runTagdb.findOne({_id:id}, function(err, doc){
      console.log('Found RunTag: ', doc._id);
    })
  }
  getRunTags(callback): RunTag[] {
    return this.runTagdb.find({}, callback);    
  }
  deleteRunTag(id: string): Boolean{
    return this.runTagdb.remove({ _id:id}, function(err,doc){
      console.log('Removed RunTag: ', doc._id);
    })
  }
  updateRunTag(tag: RunTag): Boolean {
    return this.runTagdb.update(tag, function (err, doc) {
      console.log('Updated RunTag: ', doc._id);
    });
  }
}
