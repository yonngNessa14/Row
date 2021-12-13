/**
 * Copyright (c) 2019 Jonathan Andersen
 * Copyright (c) 2019 William R. Sullivan
 *
 * This software is proprietary and owned by Jonathan Andersen.
 *
 * This software was based on https://github.com/wrsulliv/SDKLibrary,
 * licensed under the MIT license.
 */
import { HTTPSDK } from "../abstract-sdks";
import { SessionGeneralStatusStat, SessionGeneralStatusStatInternal, SessionSearchMetadata } from "../models";
export declare class SessionGeneralStatSDK extends HTTPSDK<SessionGeneralStatusStat, SessionGeneralStatusStat, SessionGeneralStatusStatInternal, SessionSearchMetadata> {
    protected endpoint: string;
}
