import { BaseObject } from "./object-model";
export interface ScheduledWorkout {
    startTime: string;
    endTime: string;
    name: string;
    description: string;
    isRace?: boolean;
    isStreamed?: boolean;
}
export interface ScheduledWorkoutInternal extends ScheduledWorkout, BaseObject {
}
