import { BaseObject } from "./object-model";
export interface Team {
    players: string[];
    invites: string[];
    name?: string;
    avatar_url?: string;
}
export interface TeamInternal extends Team, BaseObject {
}
