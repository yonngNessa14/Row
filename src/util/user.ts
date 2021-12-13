import { APIUser, Profile, Team } from 'sdk-library';
import { conf } from '../config';
import { RepoConfig } from '../models/config';
import { CreateUserParamsInternal } from '../models/user';
import { getTeamRepo } from '../repositories';
import { getProfileRepo } from '../repositories/profile';
import {  createTeam, retrieveTeam } from '../services/team-service';
import { createNewUser, retrieveUser } from '../services/user-service';

const host = 'http://localhost:3000/v0';

// const teamSDK = new TeamSDK(host);
//  const tokenSDK = new TokenSDK(host);
//  const profileSDK = new ProfileSDK(host);

//  Initialize the Repos
const repoOptions: RepoConfig = conf.get('repository');
const profileRepo = getProfileRepo(repoOptions.profile);

export interface UserConfig {
  user: CreateUserParamsInternal;
  profile: Profile;
  isTeamOwner?: boolean;
 }

 export interface TeamConfig {
   name: string;
   avatar: string;
 }
export const createUsers = async (users: CreateUserParamsInternal[]) => {
  for (const user of users) {
    const existing = await retrieveUser(user.username);
    if (!existing) {
      await createNewUser(user);
    }
  }
};

export const createUsersFromConfig = async (users: UserConfig[], teamConfig: TeamConfig) => {

  const userMap: { [userId: string]: APIUser } = {};

  for (const user of users) {
    const existing = await retrieveUser(user.user.username);
    if (!existing) {
      const newUser = await createNewUser(user.user);
      userMap[newUser.username] = newUser;
      // const token = (await tokenSDK.create({ username: user.user.username, password: user.user.password })).token;
      await profileRepo.create(user.user.username, { ...user.profile, id: user.user.username });
    } else {
      userMap[existing.username] = existing;
    }
  }

  //  Get the Owner
  const owner = users.find(user => user.isTeamOwner === true);
  if (!owner)  {
    console.log('Built the Users, but no Owner was specified.');
    return;
  }

  //  Get the Owner Token
  // const token = (await tokenSDK.create({ username: owner.user.username, password: owner.user.password })).token;

  //  Make the Team
  // const existingTeam = await retrieveTeam(teamConfig.name, userMap[owner.user.username])

  try {
    const team: Team = { players: users.map(user => user.user.username), invites: [], name: teamConfig.name, avatar_url: teamConfig.avatar };
    await createTeam(team, owner.user);
  } catch (err) {
    console.log('Error while creating the team.  Most likely, the coach is already assigned to a team, or the team already exists: ' + err);
  }


  //
};

