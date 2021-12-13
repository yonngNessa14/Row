"use strict";
/**
 * Copyright (C) William R. Sullivan.
 * This source is licensed under the MIT license.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_sdks_1 = require("../abstract-sdks");
class ScheduledWorkoutSDK extends abstract_sdks_1.HTTPSDK {
    constructor() {
        super(...arguments);
        this.endpoint = 'scheduled-workouts';
    }
}
exports.ScheduledWorkoutSDK = ScheduledWorkoutSDK;
//# sourceMappingURL=scheduled-workout-sdk.js.map