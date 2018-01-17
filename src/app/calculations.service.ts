import { Injectable } from '@angular/core';
import { RunGoal } from './run-goal'
import { RunGoalGraph } from './run-goal-graph'
import { Calculations } from './calculations'
import * as moment from "moment";

@Injectable()
export class CalculationsService implements Calculations {

  constructor() { }

  Pace(goal: RunGoal): number {
    return goal.distance / (goal.duration / 3600);
  }

  Velocity(goal: RunGoal): number {
    return (goal.distance * 1609.34) / (goal.duration / 60)
  }

  VO2Max(goal: RunGoal): number {
    var v = this.Velocity(goal);
    return (0.000104 * (v * v) + (0.182258 * v) - 4.6)
      / (0.2989558 * Math.pow(Math.E, -0.1932605 * goal.duration / 60) + 0.1894393 * Math.pow(Math.E, -0.012778 * goal.duration / 60) + .8)
  }

  Duration(hours: number, minutes: number, seconds: number): number {
    var duration: number = 0;
    if (this.isNumeric(hours)) {
      if (+hours >= 0 && +hours < 24) {
        duration += +hours * 3600;
      }
    }
    if (this.isNumeric(minutes)) {
      if (+minutes >= 0 && +minutes < 60) {
        duration += +minutes * 60;
      }
    }
    if (this.isNumeric(seconds)) {
      if (+seconds >= 0 && +seconds < 60) {
        duration += +seconds;
      }
    }
    return duration;
  }

  isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  DurationToString(seconds: number) {
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    var seconds = seconds % 60;

    return "HH: " + hours + " MM: " + minutes + " SS: " + seconds;
  }

  GetTrendLine(data: RunGoalGraph, maxDate:Date): RunGoalGraph {
    var slope = this.FindSlope(data);
    var intercept = this.FindIntercept(data, slope);
    var TrendGraph = new RunGoalGraph();
    var d1 = data.goals[0];
    var date1 = moment(d1.date);
    var date2 = moment(maxDate);
    var g1 = new RunGoal();
    g1.date=d1.date;
    g1.vo2Max = intercept;
    var g2 = new RunGoal();
    g2.date = maxDate;
    g2.vo2Max = slope * (date2.diff(date1,'days')) + intercept;    
    TrendGraph.goals.push(g1);
    TrendGraph.goals.push(g2);
    TrendGraph.projection = true;
    return TrendGraph;
  }

  FindSlope(data: RunGoalGraph): number {
    var goals = data.goals;
    var slopes = new Array<number>();
    for (var i: number = 0; i < goals.length - 1; i++) {
      for (var j: number = i + 1; j < goals.length; j++) {
        var momentJ = moment(goals[j].date);
        var momentI = moment(goals[i].date);
        slopes.push((this.VO2Max(goals[j]) - this.VO2Max(goals[i])) / (momentJ.diff(momentI, 'days')))
      }
    }
    slopes.sort();
    var slope = slopes[Math.floor(slopes.length / 2)];
    return slope;
  }

  FindIntercept(data: RunGoalGraph, slope: number) {
    var intercepts = new Array<number>();
    var goals = data.goals;
    var dateMin = goals[0].date;
    goals.forEach((x) => {
      var dateX = moment(x.date);
      intercepts.push(this.VO2Max(x) - slope * (dateX.diff(dateMin, 'days')));
    })
    intercepts.sort();
    return intercepts[Math.floor(intercepts.length / 2)];
  }
}
