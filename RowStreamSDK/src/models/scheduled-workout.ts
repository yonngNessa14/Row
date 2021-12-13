import { BaseObject } from "./object-model";

//  TS Interfaces
export interface ScheduledWorkout {
  startTime: string;
  endTime: string;
  name: string;
  description: string;

  //  NOTE:  We support several options for a "Race Workout".  When we have a TOTAllY different experience, we can make a new Workout type?
  //  IDEA:  We CAN show different "Workout Types" in the frontend, but PERHAPS all the options are stored here?  This WILL almost certainly get more complex.  We can adjust as we need to.
  isRace?: boolean;
  isStreamed?: boolean;
}

export interface ScheduledWorkoutInternal extends ScheduledWorkout, BaseObject {}
