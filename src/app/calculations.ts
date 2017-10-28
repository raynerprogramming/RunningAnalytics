import { RunGoal } from './run-goal'
export interface Calculations {
    Pace(goal: RunGoal): number;
    Velocity(goal: RunGoal): number;
    VO2Max(goal: RunGoal): number;
    Duration(hours: number, minutes: number, seconds: number): number;
    isNumeric(n);
}
