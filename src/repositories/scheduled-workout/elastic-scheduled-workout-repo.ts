/**
 * Copyright (c) 2019 Jonathan Andersen
 * Copyright (c) 2019 William R. Sullivan
 *
 * This software is proprietary and owned by Jonathan Andersen.
 *
 * This software was based on https://github.com/wrsulliv/NodeStarter,
 * licensed under the MIT license.
 */

import { ElasticRepo } from '../elastic-crud';
import { conf } from '../../config';
import { ElasticConfig } from '../../models/config';
import { scheduledWorkoutInternalElasticSchema } from '../../models/scheduled-workout';
import { ScheduledWorkoutInternal } from 'sdk-library';

const elasticConf: ElasticConfig = conf.get('elastic');
const { disk_hack: diskHack } = elasticConf;

export class ElasticScheduledWorkoutRepo extends ElasticRepo<ScheduledWorkoutInternal> {
  protected indexName = 'scheduled-workout';
  protected properties = scheduledWorkoutInternalElasticSchema;
  protected readOnly = diskHack ? false : undefined;
}