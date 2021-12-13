/**
 * Copyright (c) 2019 Jonathan Andersen
 * Copyright (c) 2019 William R. Sullivan
 *
 * This software is proprietary and owned by Jonathan Andersen.
 *
 * This software was based on https://github.com/wrsulliv/NodeStarter,
 * licensed under the MIT license.
 */

import { Role, SearchParams, ScheduledWorkout, ScheduledWorkoutInternal } from 'sdk-library';
import { conf } from '../config';
import { RepoConfig } from '../models/config';
import { createBaseObject, updateBaseObject } from '../models/object';
import { UserInternal } from '../models/user';
import { Entity, InstanceAction, validateInstance } from './auth-service';
import { getScheduledWorkoutRepo } from '../repositories/scheduled-workout';

//  Initialize the Repos
const repoOptions: RepoConfig = conf.get('repository');
const scheduledWorkoutRepo = getScheduledWorkoutRepo(repoOptions.scheduled_workout);

const validateManagedWorkout = (scheduledWorkoutInternal: ScheduledWorkoutInternal) => {

  //  Validate the Object
  const currentTime = new Date();
  if (new Date(scheduledWorkoutInternal.startTime).getTime() < currentTime.getTime()) {
    throw new Error('Cannot create a managed workout scheduled in the past.');
  }
  if (new Date(scheduledWorkoutInternal.endTime).getTime() < new Date(scheduledWorkoutInternal.startTime).getTime()) {
    throw new Error('Cannot create a managed workout which ends prior to the start time.');
  }
};

export const createScheduledWorkout = async (scheduledWorkout: ScheduledWorkout, user: UserInternal) => {

  //  Verify Coach
  if ((user.roles.indexOf(Role.Coach) == -1) && (user.roles.indexOf(Role.Administrator) == -1)) { throw new Error('Unauthorized:  Only Coaches and Administrators are permitted to create new scheduledWorkouts.'); }

  //  Define the Object
  const baseObj = createBaseObject(user);
  const scheduledWorkoutInternal: ScheduledWorkoutInternal = { ...scheduledWorkout, ...baseObj };

  //  Validate the Object
  validateManagedWorkout(scheduledWorkoutInternal);

  //  Store the Object
  await scheduledWorkoutRepo.create(scheduledWorkoutInternal.id, scheduledWorkoutInternal);

  //  Return
  return scheduledWorkoutInternal;
};

export const retrieveScheduledWorkout = async (scheduledWorkoutId: string, user: UserInternal) => {

  //  Get the ScheduledWorkout
  const scheduledWorkoutInternal = await scheduledWorkoutRepo.retrieve(scheduledWorkoutId);

  //  Validate Instance Access
  const hasAccess = await validateInstance(Entity.ScheduledWorkout, InstanceAction.Read, user, scheduledWorkoutInternal);
  if (!hasAccess) { throw new Error('Unauthorized'); }

  //  Return the ScheduledWorkout
  return scheduledWorkoutInternal;
};

export const searchScheduledWorkouts = async (params: SearchParams, user: UserInternal) => {

  //  Get the ScheduledWorkouts
  //  TODO:  Sanitize the query.
  //  TODO:  Eventually use ACL in search instead of post-search for-loop.
  const scheduledWorkoutInternalList = await scheduledWorkoutRepo.search(params);

  //  Validate Instance Access
  //  TODO:  Fix results count from pagination!  We should be filtering WITHIN the search to avoid extra return values.
  const permissionedScheduledWorkoutList: ScheduledWorkoutInternal[] = [];
  for (let index = 0; index < scheduledWorkoutInternalList.results.length; index++) {
    const scheduledWorkout = scheduledWorkoutInternalList.results[index];
    const hasAccess = await validateInstance(Entity.ScheduledWorkout, InstanceAction.Read, user, scheduledWorkout);
    if (hasAccess) {
      permissionedScheduledWorkoutList.push(scheduledWorkout);
    }
  }

  //  Return the ScheduledWorkouts
  return { results: permissionedScheduledWorkoutList, total: scheduledWorkoutInternalList.total };
};

export const updateScheduledWorkout = async (scheduledWorkoutId: string, scheduledWorkout: ScheduledWorkout, user: UserInternal) => {

  //  Get Existing
  const existingScheduledWorkout = await scheduledWorkoutRepo.retrieve(scheduledWorkoutId);

  //  Validate Instance Access
  const hasAccess = await validateInstance(Entity.ScheduledWorkout, InstanceAction.Write, user, existingScheduledWorkout);
  if (!hasAccess) { throw new Error('Unauthorized'); }

  //  Define the Object
  const baseObj = updateBaseObject(existingScheduledWorkout);
  const updatedScheduledWorkout = { ...scheduledWorkout, ...baseObj };

  //  Validate the Object
  validateManagedWorkout(updatedScheduledWorkout);

  //  Store the Object
  await scheduledWorkoutRepo.update(updatedScheduledWorkout.id, updatedScheduledWorkout);

  //  Return the ScheduledWorkout
  return updatedScheduledWorkout;
};