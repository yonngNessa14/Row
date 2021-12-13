"use strict";
/**
 * Copyright (C) William R. Sullivan.
 * This source is licensed under the MIT license.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_sdks_1 = require("../abstract-sdks");
class UserSDK extends abstract_sdks_1.HTTPSDK {
    constructor() {
        super(...arguments);
        this.endpoint = 'users';
    }
}
exports.UserSDK = UserSDK;
//# sourceMappingURL=user-sdk.js.map