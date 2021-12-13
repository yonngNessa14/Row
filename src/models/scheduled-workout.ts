/**
 * Copyright (c) 2019 Jonathan Andersen
 * Copyright (c) 2019 William R. Sullivan
 *
 * This software is proprietary and owned by Jonathan Andersen.
 *
 * This software was based on https://github.com/wrsulliv/NodeStarter,
 * licensed under the MIT license.
 */

import * as Joi from 'joi';
import { baseObjectJoiSchema, baseObjectElasticSchema } from './object';

//  Elastic Schema
export const scheduledWorkoutElasticSchema = {
  'startTime': { 'type': 'date' },
  'endTime': { 'type': 'date' },
  'name': { 'type': 'keyword' },
  'description': { 'type': 'text' },
  'isRace': { 'type': 'boolean' },
  'isStreamed': { 'type': 'boolean' },
};

export const scheduledWorkoutInternalElasticSchema = {
  ...scheduledWorkoutElasticSchema,
  ...baseObjectElasticSchema
};

//  Joi Schemas
const scheduledWorkoutJoiProps = {
  startTime: Joi.date().iso().required(),
  endTime: Joi.date().iso().required(),
  name: Joi.string().required(),
  description: Joi.string().required(),
  isRace: Joi.boolean().required(),
  isStreamed: Joi.boolean().required()
};
export const scheduledWorkoutJoiSchema = Joi.object().keys(scheduledWorkoutJoiProps);
export const scheduledWorkoutInternalJoiSchema = baseObjectJoiSchema.keys(scheduledWorkoutJoiProps);
