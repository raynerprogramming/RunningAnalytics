import { RunTag } from './run-tag';
import { RunGoal } from './run-goal';

export class RunLog extends RunGoal {
    constructor(distance?:number, duration?:number, date?:Date,tags?:RunTag[])
    {
        super(distance,duration,date)
        this.tags=tags;
    }
    tags: RunTag[] = [];    
}
