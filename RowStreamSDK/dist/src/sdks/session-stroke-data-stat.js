"use strict";
/**
 * Copyright (c) 2019 Jonathan Andersen
 * Copyright (c) 2019 William R. Sullivan
 *
 * This software is proprietary and owned by Jonathan Andersen.
 *
 * This software was based on https://github.com/wrsulliv/SDKLibrary,
 * licensed under the MIT license.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_sdks_1 = require("../abstract-sdks");
class SessionStrokeDataStatSDK extends abstract_sdks_1.HTTPSDK {
    constructor() {
        super(...arguments);
        this.endpoint = 'session-stroke-data-stats';
    }
}
exports.SessionStrokeDataStatSDK = SessionStrokeDataStatSDK;
//# sourceMappingURL=session-stroke-data-stat.js.map