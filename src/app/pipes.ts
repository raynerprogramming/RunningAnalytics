import { Pipe, PipeTransform } from '@angular/core';
import { RunLog } from './run-log';
import * as moment from 'moment';

@Pipe({name: 'customOrderBy'})
export class CustomOrderBy implements PipeTransform {
  transform(logs: Array<RunLog>, orderBy: string): Array<RunLog> {
    if(orderBy=="date"){
        logs.sort((a:RunLog,b:RunLog) => {        
            var momentA = moment(a.date);
            var momentB = moment(b.date);
            if(momentA < momentB){
                return 1;
            }
            if(momentA > momentB){
                return -1;
            }
            return 0;
        })
    }
    return logs;
  }
}