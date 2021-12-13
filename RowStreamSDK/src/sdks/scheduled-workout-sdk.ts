/**
 * Copyright (C) William R. Sullivan.
 * This source is licensed under the MIT license.
 */

import { HTTPSDK } from "../abstract-sdks";
import { ScheduledWorkout, ScheduledWorkoutInternal } from "../models";

export class ScheduledWorkoutSDK extends HTTPSDK<ScheduledWorkout, ScheduledWorkout, ScheduledWorkoutInternal> {
  protected endpoint = 'scheduled-workouts';
}