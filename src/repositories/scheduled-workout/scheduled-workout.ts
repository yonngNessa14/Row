/**
 * Copyright (C) William R. Sullivan - All Rights Reserved
 * Written by William R. Sullivan <wrsulliv@umich.edu>, January 2019
 */

import { CRUDRepo } from '../crud';
import { ElasticScheduledWorkoutRepo } from './elastic-scheduled-workout-repo';
import { ScheduledWorkoutInternal } from 'sdk-library';

const repoSelectionToConstructor: { [repo: string]: any } = {
  elastic: ElasticScheduledWorkoutRepo
};

export const getScheduledWorkoutRepo = (repo: string): CRUDRepo<ScheduledWorkoutInternal> => {
  const constructor = repoSelectionToConstructor[repo];
  if (!constructor) { throw new Error(`The selected repository is not registered: '${repo}'`); }
  const repoInst: CRUDRepo<ScheduledWorkoutInternal> = new constructor();
  return repoInst;
};
