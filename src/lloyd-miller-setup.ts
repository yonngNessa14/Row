/**
 * Copyright (c) 2019 Jonathan Andersen
 * Copyright (c) 2019 William R. Sullivan
 *
 * This software is proprietary and owned by Jonathan Andersen.
 *
 * This software was based on https://github.com/wrsulliv/NodeStarter,
 * licensed under the MIT license.
 */

import { ProfileSDK, Role, TeamSDK, TokenSDK } from 'sdk-library';
import { CreateUserParamsInternal } from './models/user';
import { createUsersFromConfig, TeamConfig, UserConfig } from './util/user';

 const host = 'http://localhost:3000/v0';

 //  Create the SDKs
 const teamSDK = new TeamSDK(host);
 const tokenSDK = new TokenSDK(host);
 const profileSDK = new ProfileSDK(host);

 const users: CreateUserParamsInternal[][] = [];

 const password = 'rowstream2021';
 export const createLloydMiller = async () => {

  const j3Users: UserConfig[] = [
    {
      user: {
        username: 'jon',
        email: 'jon@rowstream.com',
        password: password,
        verified: true,
        roles: [Role.Coach, Role.Rower]
      },
      profile: {
        name: 'Jon Andersen',
        city: 'Los Angeles',
        state: 'CA',
        avatar: 'https://images.unsplash.com/photo-1548372290-8d01b6c8e78c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2250&q=80'
      }
    },
    {
      user: {
        username: 'jack',
        email: 'powerhousefit@gmail.com',
        password: password,
        verified: true,
        roles: [Role.Member, Role.Rower]
      },
      profile: {
        name: 'Jack Nunn',
        city: 'Los Angeles',
        state: 'CA',
        avatar: 'https://images.unsplash.com/photo-1548372290-8d01b6c8e78c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2250&q=80'
      }
    },
    {
      user: {
        username: 'josh',
        email: 'josh.collins@blount.com',
        password: password,
        verified: true,
        roles: [Role.Member, Role.Rower]
      },
      profile: {
        name: 'Josh Collins',
        city: 'Las Angeles',
        state: 'CA',
        avatar: 'https://images.unsplash.com/photo-1548372290-8d01b6c8e78c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2250&q=80'
      },
    },
    {
      user: {
        username: 'henry',
        email: 'wrsulliv@icloud.com',
        password: password,
        verified: true,
        roles: [Role.Member, Role.Rower, Role.Coach]
      },
      profile: {
        name: 'Henry Allen',
        city: 'Las Angeles',
        state: 'CA',
        avatar: 'https://images.unsplash.com/photo-1548372290-8d01b6c8e78c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2250&q=80'
      },
      isTeamOwner: true
    },
    {
      user: {
        username: 'david',
        email: 'daw@collinswillmott.com',
        password: password,
        verified: true,
        roles: [Role.Member, Role.Rower]
      },
      profile: {
        name: 'David Willmott',
        city: 'Memphis',
        state: 'TN',
        avatar: 'https://images.unsplash.com/photo-1548372290-8d01b6c8e78c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2250&q=80'
      }
    },
    {
      user: {
        username: 'steve',
        email: 'stromsteve@hotmail.com',
        password: password,
        verified: true,
        roles: [Role.Member, Role.Rower]
      },
      profile: {
        name: 'Steve Strom',
        city: 'Spokane',
        state: 'WA',
        avatar: 'https://images.unsplash.com/photo-1548372290-8d01b6c8e78c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2250&q=80'
      }
    }
  ];

  const teamConfig: TeamConfig = {
    name: 'Lloyd Miller Memorial Boathouse',
    avatar: 'https://images.unsplash.com/photo-1597097273683-22337c365fb7?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=932&q=80'
  };

  //  Create the Users
  await createUsersFromConfig(j3Users, teamConfig);

  console.log('Created the Lloyd Miller Boathouse');
 };

//  start();
