export class RunGoal {
    constructor(distance?: number, duration?: number, date?: Date, active?: boolean) {
        this.distance = distance;
        this.duration = duration;
        this.date = date;
        this.active = active;
    }
    distance: number;
    duration: number;
    date: Date;
    vo2Max: number;
    active: boolean;
}
