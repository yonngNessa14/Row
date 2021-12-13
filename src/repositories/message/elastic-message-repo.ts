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
import { MessageInternal } from 'sdk-library';
import { messageInternalElasticSchema } from '../../models/message';

const elasticConf: ElasticConfig = conf.get('elastic');
const { disk_hack: diskHack } = elasticConf;

export class ElasticMessageRepo extends ElasticRepo<MessageInternal> {
  protected indexName = 'message';
  protected properties = messageInternalElasticSchema;
  protected readOnly = diskHack ? false : undefined;
}