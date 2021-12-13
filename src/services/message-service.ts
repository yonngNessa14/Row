/**
 * Copyright (c) 2021 Jonathan Andersen
 * Copyright (c) 2021 William R. Sullivan
 *
 * This software is proprietary and owned by Jonathan Andersen.
 *
 * This software was based on https://github.com/wrsulliv/NodeStarter,
 * licensed under the MIT license.
 */

import { APIUser, SearchParams, Message, MessageInternal } from 'sdk-library';
import { conf } from '../config';
import { RepoConfig } from '../models/config';
import { createBaseObject, updateBaseObject } from '../models/object';
import { UserInternal } from '../models/user';
import { getMessageRepo } from '../repositories';
import { Entity, InstanceAction, validateInstance } from './auth-service';

const repoOptions: RepoConfig = conf.get('repository');
const messageRepo = getMessageRepo(repoOptions.message);

export const createMessage = async (message: Message, user: APIUser) => {

  //  TODO:  Verify the recipient exists and the user has access.

  //  Create the Message
  const baseObj = createBaseObject(user);
  const messageInternal: MessageInternal = { ...message, ...baseObj };
  await messageRepo.create(messageInternal.id, messageInternal);

  //  Return
  return messageInternal;
};

export const retrieveMessage = async (messageId: string, user: APIUser) => {

  //  Get the Message
  const messageInternal = await messageRepo.retrieve(messageId);

  //  Return the Message
  return messageInternal;
};

export const searchMessages = async (params: SearchParams, user: APIUser) => {

  //  Get the Messages
  const messageInternalList = await messageRepo.search(params);

  //  Validate Instance Access
  //  TODO:  Fix results count from pagination!  We should be filtering WITHIN the search to avoid extra return values.
  const permissionedMessageList: MessageInternal[] = [];
  for (let index = 0; index < messageInternalList.results.length; index++) {
    const message = messageInternalList.results[index];
    const hasAccess = await validateInstance(Entity.Message, InstanceAction.Read, user, message);
    if (hasAccess) {
      permissionedMessageList.push(message);
    }
  }

  //  Return the Messages
  return { results: permissionedMessageList, total: permissionedMessageList.length };
};

export const updateMessage = async (messageId: string, message: Message, user: UserInternal) => {

  //  Get Existing
  const existingMessage = await messageRepo.retrieve(messageId);

  //  Update the Message
  const baseObj = updateBaseObject(existingMessage);
  const updatedMessage = { ...message, ...baseObj };
  await messageRepo.update(updatedMessage.id, updatedMessage);

  //  Return the Message
  return updatedMessage;
};