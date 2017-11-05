import { RunGoal } from './run-goal';

export class RunGoalGraph {
    constructor() {
        this.active=true;
        this.goals = new Array<RunGoal>();
    }
    selected: boolean;
    active: boolean;
    hover: boolean;
    goals: RunGoal[]
    color: string;
    projection: boolean;
}
