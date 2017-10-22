import { Injectable } from '@angular/core';
import { RunLog } from './run-log'
import { RunTag } from './run-tag'
import { RunGoal } from './run-goal'
import { NedbService } from './nedb.service';

@Injectable()
export class StorageService {

  constructor(private storage: NedbService) { }  

  getRunLog(id:string): RunLog{
    return this.storage.getRunLog(id);
  }
  getRunLogs(callback): RunLog[] {
    return this.storage.getRunLogs(callback);
  }
  deleteRunLog(id:string): Boolean {
    return this.storage.deleteRunLog(id);
  }
  createRunLog(log:RunLog): Boolean{
    return this.storage.createRunLog(log);
  }
  updateRunLog(log:RunLog): Boolean{
    return this.storage.updateRunLog(log);
  }

  getRunTag(id:string): RunTag{
    return this.storage.getRunTag(id);
  }
  getRunTags(callback): RunTag[]{
    return this.storage.getRunTags(callback);
  }
  createRunTag(tag: RunTag){
    return this.storage.createRunTag(tag);
  }
  deleteRunTag(id: string): Boolean{
    return this.storage.deleteRunTag(id);
  }
  updateRunTag(tag: RunTag): Boolean {
    return this.storage.updateRunTag(tag);
  }

  getRunGoal(id:string): RunGoal{
    return this.storage.getRunGoal(id);
  }
  getRunGoals(callback): RunGoal[]{
    return this.storage.getRunGoals(callback);
  }
  deleteRunGoal(id:string): Boolean {
    return this.storage.deleteRunGoal(id);
  }
  createRunGoal(goal:RunGoal): Boolean{
    return this.storage.createRunGoal(goal);
  }
  updateRunGoal(goal:RunGoal): Boolean{
    return this.storage.updateRunGoal(goal);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}

