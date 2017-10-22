import { Pipe, PipeTransform } from '@angular/core';
import { RunLog } from './run-log';
import { CalculationsService } from './calculations.service';
import * as moment from 'moment';

@Pipe({ name: 'customOrderBy' })
export class CustomOrderBy implements PipeTransform {
    constructor(public runCalc: CalculationsService) { }
    transform(logs: Array<RunLog>, orderBy: string, asc: boolean): Array<RunLog> {

        var returnA: number = asc ? 1 : -1;
        var returnB: number = asc ? -1 : 1;
        if (orderBy == "date") {
            logs.sort((a: RunLog, b: RunLog) => {
                var momentA = moment(a.date);
                var momentB = moment(b.date);
                if (momentA < momentB) {
                    return returnA;
                }
                if (momentA > momentB) {
                    return returnB;
                }
                return 0;
            })
        }
        if (orderBy == "duration") {
            logs.sort((a: RunLog, b: RunLog) => {
                if (a.duration < b.duration) {
                    return returnA;
                }
                if (a.duration > b.duration) {
                    return returnB;
                }
                return 0;
            })
        }
        if (orderBy == "distance") {
            logs.sort((a: RunLog, b: RunLog) => {
                if (a.distance < b.distance) {
                    return returnA;
                }
                if (a.distance > b.distance) {
                    return returnB;
                }
                return 0;
            })
        }
        if (orderBy == "pace") {
            logs.sort((a: RunLog, b: RunLog) => {
                var paceA = this.runCalc.Pace(a);
                var paceB = this.runCalc.Pace(b);
                if (paceA < paceB) {
                    return returnA;
                }
                if (paceA > paceB) {
                    return returnB;
                }
                return 0;
            })
        }
        if (orderBy == "VO2Max") {
            logs.sort((a: RunLog, b: RunLog) => {
                var vo2A = this.runCalc.VO2Max(a);
                var vo2B = this.runCalc.VO2Max(b);
                if (vo2A < vo2B) {
                    return returnA;
                }
                if (vo2A > vo2B) {
                    return returnB;
                }
                return 0;
            })
        }
        return logs;
    }
}