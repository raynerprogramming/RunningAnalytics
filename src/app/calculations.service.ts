import { Injectable } from '@angular/core';
import { RunGoal } from './run-goal'
@Injectable()
export class CalculationsService {

  constructor() { }
  Pace(goal: RunGoal): number {
    return goal.distance / (goal.duration / 3600);
  }
  Velocity(goal: RunGoal): number {
    return (goal.distance * 1609.34) / (goal.duration / 60)
  }
  VO2Max(goal: RunGoal): number {
    return (0.000104 * (this.Velocity(goal) * this.Velocity(goal)) + (0.182258 * this.Velocity(goal)) - 4.6)
    / (0.2989558 * Math.pow(Math.E, -0.1932605 * goal.duration / 60) + 0.1894393 * Math.pow(Math.E, -0.012778 * goal.duration / 60) + .8)
  }
}
