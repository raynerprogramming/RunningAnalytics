export class RunGoal {
    constructor(distance?:number, duration?:number, date?:Date) {
        this.distance = distance;
        this.duration = duration;
        this.date = date;
    }
    distance: number;
    duration: number;
    date: Date;
    vo2Max: number;    
}
