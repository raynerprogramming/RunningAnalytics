import { Injectable } from '@angular/core';
import { RunLog } from './run-log'
import { RunTag } from './run-tag'
import { RunGoal } from './run-goal'
import * as Datastore from 'nedb'

@Injectable()
export class NedbService {
  runLogdb: Datastore;
  runTagdb: Datastore;
  runGoaldb: Datastore;

  constructor() {
    this.runLogdb = new Datastore({ filename: 'RunLog.db', autoload: true });
    this.runTagdb = new Datastore({ filename: 'RunTag.db', autoload: true });
    this.runGoaldb = new Datastore({ filename: 'RunGoal.db', autoload: true });
  }

  getRunLog(id: string): RunLog {
    return this.findOne(this.runLogdb,id);
  }
  getRunLogs(callback): RunLog[] {
    return this.findAll(this.runLogdb,callback);
  }
  deleteRunLog(id: string): Boolean {
    return this.deleteOne(this.runLogdb,id);
  }
  createRunLog(log: RunLog): Boolean {
    return this.create(this.runLogdb,log);
  }
  updateRunLog(log: RunLog): Boolean {
    return this.runLogdb.update({ _id: log["_id"] },
      {
        $set: {
          "distance": log.distance,
          "date": log.date,
          "duration": log.duration,
          "tags": log.tags
        }
      },
      {}
      ,
      function (err, doc) {
        console.log('Removed RunLog: ', doc._id);
      });
  }
  createRunTag(tag: RunTag) {
    return this.create(this.runTagdb,tag);
  }
  getRunTag(id: string) {
    return this.findOne(this.runTagdb,id);
  }
  getRunTags(callback): RunTag[] {
    return this.runTagdb.find({}, callback);
  }
  deleteRunTag(id: string): Boolean {
    return this.deleteOne(this.runTagdb,id);
  }
  updateRunTag(tag: RunTag): Boolean {
    return this.runTagdb.update(tag, function (err, doc) {
      console.log('Updated RunTag: ', doc._id);
    });
  }

  getRunGoal(id:string): RunGoal{
    return this.findOne(this.runGoaldb,id);
  }
  getRunGoals(callback): RunGoal[]{
    return this.findAll(this.runGoaldb,callback);
  }
  deleteRunGoal(id:string): Boolean {
    return this.deleteOne(this.runGoaldb,id);
  }
  createRunGoal(goal:RunGoal): Boolean{
    return this.create(this.runGoaldb,goal);
  }
  updateRunGoal(goal:RunGoal): Boolean{
    return this.runGoaldb.update({ _id: goal["_id"] },
    {
      $set: {
        "distance": goal.distance,
        "date": goal.date,
        "duration": goal.duration
      }
    },
    {}
    ,
    function (err, doc) {
      console.log('Removed RunGoal: ', doc._id);
    });
  }

  findOne(data:Datastore, id:string):any {
    return data.findOne({_id:id});
  }
  findAll(data:Datastore, callback):any[] {
    return data.find({}, callback);
  }
  create(data:Datastore, obj:any): Boolean {
    return data.insert(obj)
  }
  deleteOne(data:Datastore, id:string): Boolean {
    return data.remove({ _id: id });
  }
}
