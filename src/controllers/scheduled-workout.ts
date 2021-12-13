/**
 * Copyright (c) 2019 Jonathan Andersen
 * Copyright (c) 2019 William R. Sullivan
 *
 * This software is proprietary and owned by Jonathan Andersen.
 *
 * This software was based on https://github.com/wrsulliv/NodeStarter,
 * licensed under the MIT license.
 */

import { NextFunction, Response } from 'express';
import * as Joi from 'joi';
import { ScheduledWorkout, SearchParams } from 'sdk-library';
import { CustomRequest } from '../models/request';
import { scheduledWorkoutJoiSchema } from '../models/scheduled-workout';
import { UserInternal } from '../models/user';
import { Entity, EntityAction, validateRoute } from '../services/auth-service';
import * as ScheduledWorkoutService from '../services/scheduled-workout-service';

export const createScheduledWorkout = async (req: CustomRequest, res: Response, next: NextFunction) => {

  try {

    //  Get the User
    const user: UserInternal = req.locals.user;

    //  Validate Route Access
    //  TODO:  Move to decorator?
    validateRoute(Entity.ScheduledWorkout, EntityAction.Create, user);

    //  Validate Input
    const validatedBody = Joi.validate(req.body, scheduledWorkoutJoiSchema, { convert: true });
    if (validatedBody.error) { throw new Error('Invalid body'); }
    const scheduledScheduledWorkout: ScheduledWorkout = validatedBody.value;

    //  Create the scheduledScheduledWorkout
    const scheduledScheduledWorkoutInternal = await ScheduledWorkoutService.createScheduledWorkout(scheduledScheduledWorkout, user);

    //  Return
    res.status(201).send(scheduledScheduledWorkoutInternal);

  } catch (err) {
    //  TODO:  Catch system errors.
    next(err);
    return;
  }
};

export const retrievescheduledScheduledWorkout = async (req: CustomRequest, res: Response, next: NextFunction) => {

  try {

    //  Get the logged in user
    const user: UserInternal = req.locals.user;

    //  Validate Route Access
    validateRoute(Entity.ScheduledWorkout, EntityAction.Retrieve, user);

    //  Get the scheduledScheduledWorkout ID
    const scheduledScheduledWorkoutId = req.params.scheduledScheduledWorkoutId;

    //  Get the scheduledScheduledWorkout
    const scheduledScheduledWorkoutInternal = await ScheduledWorkoutService.retrieveScheduledWorkout(scheduledScheduledWorkoutId, user);

    //  Return the scheduledScheduledWorkout
    res.status(200).json(scheduledScheduledWorkoutInternal);

  } catch (err) {
    //  TODO:  Catch system errors.
    next(err);
    return;
  }
};

export const searchscheduledScheduledWorkouts = async (req: CustomRequest, res: Response, next: NextFunction) => {

  try {

    //  Get the logged in user
    const user: UserInternal = req.locals.user;

    //  Validate Route Access
    validateRoute(Entity.ScheduledWorkout, EntityAction.Search, user);

    //  Unpack
    const params: SearchParams = req.body;

    //  Get the scheduledScheduledWorkouts
    const searchRes = await ScheduledWorkoutService.searchScheduledWorkouts(params, user);

    //  Return the scheduledScheduledWorkouts
    res.status(200).json(searchRes);

  } catch (err) {
    //  TODO:  Catch system errors.
    next(err);
    return;
  }
};

export const updatescheduledScheduledWorkout = async (req: CustomRequest, res: Response, next: NextFunction) => {

  try {
    //  Get the logged in user
    const user: UserInternal = req.locals.user;

    //  Validate Route Access
    validateRoute(Entity.ScheduledWorkout, EntityAction.Search, user);

    //  Get the scheduledScheduledWorkout ID
    const scheduledScheduledWorkoutId = req.params.scheduledScheduledWorkoutId;

    //  Validate Input
    const validatedBody = Joi.validate(req.body, scheduledWorkoutJoiSchema, { convert: true });
    if (validatedBody.error) {
      next('Invalid body');
      return;
    }
    const scheduledScheduledWorkout: ScheduledWorkout = validatedBody.value;

    //  Update the scheduledScheduledWorkout
    const updatedscheduledScheduledWorkout = await ScheduledWorkoutService.updateScheduledWorkout(scheduledScheduledWorkoutId, scheduledScheduledWorkout, user);

    //  Return the scheduledScheduledWorkout
    res.status(200).json(updatedscheduledScheduledWorkout);
  } catch (err) {
    //  TODO:  Catch system errors.
    next(err);
    return;
  }
};