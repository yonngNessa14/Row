import { ResolveWithTtlOptions } from "dns";

/**
 * Copyright (c) 2019 Jonathan Andersen
 * Copyright (c) 2019 William R. Sullivan
 *
 * This software is proprietary and owned by Jonathan Andersen.
 *
 * This software was based on https://github.com/wrsulliv/SDKLibrary,
 * licensed under the MIT license.
 */

export interface CreateUserParams {
  username: string;
  email: string;
  password: string;
  roles?: Role[];
  verified?: boolean;
  secret?: string;
}

export interface UpdateUserParams {
  email: string;
  password: string;
  roles?: Role[];
  verified?: boolean;
}

export interface APIUser {
  username: string;
  email: string;
  verified: boolean;
  roles: Role[];
}

export enum Role {
  Administrator = 'administrator',
  Coach = 'coach',
  Member = 'member',
  Rower = 'rower'
}