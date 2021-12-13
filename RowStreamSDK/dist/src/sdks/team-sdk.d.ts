/**
 * Copyright (C) William R. Sullivan.
 * This source is licensed under the MIT license.
 */
import { HTTPSDK } from "../abstract-sdks";
import { Team, TeamInternal } from "../models";
export declare class TeamSDK extends HTTPSDK<Team, Team, TeamInternal> {
    protected endpoint: string;
}
