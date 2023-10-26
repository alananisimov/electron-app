"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var os_1 = require("os");
var Logger = /** @class */ (function () {
    function Logger(path, enable) {
        this.path = path;
        this.enable = enable;
        this.logo =
            "\n            \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557 \n            \u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D \u255A\u2550\u2550\u2588\u2588\u2588\u2554\u255D \u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557 \u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D \n            \u2588\u2588\u2588\u2588\u2588\u2557     \u2588\u2588\u2588\u2554\u255D  \u2588\u2588\u2588\u2588\u2588\u2557   \u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\n            \u2588\u2588\u2554\u2550\u2550\u255D    \u2588\u2588\u2588\u2554\u255D   \u2588\u2588\u2554\u2550\u2550\u255D   \u2588\u2588\u2554\u2550\u2550\u2550\u255D  \u255A\u2550\u2550\u2550\u2550\u2588\u2588\u2551\n            \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2551      \u2588\u2588\u2551      \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551\n            \u255A\u2550\u2550\u2550\u2550\u2550\u2550\u255D \u255A\u2550\u2550\u2550\u2550\u2550\u2550\u255D \u255A\u2550\u255D      \u255A\u2550\u255D      \u255A\u2550\u2550\u2550\u2550\u2550\u2550\u255D\n            ";
    }
    Logger.prototype.startSession = function () {
        if (!this.enable) {
            return;
        }
        var data = this.logo;
        data += "\n\nLogSession\n - Time: ".concat(new Date(), "\n - Start: SUCCESS");
        data += "\n\nOS\n - Type: ".concat((0, os_1.type)(), "\n - Release: ").concat((0, os_1.release)(), "\n - Platform: ").concat((0, os_1.platform)(), "\n\nOutput:\n");
        try {
            (0, fs_1.writeFileSync)(this.path, data);
        }
        catch (err) {
            this.enable = false;
            console.error(err);
        }
        console.log(data);
    };
    Logger.prototype.writeLog = function (type, message) {
        if (!this.enable) {
            return;
        }
        var data = " - ".concat(type, ": ").concat(message);
        try {
            (0, fs_1.appendFileSync)(this.path, data + "\n");
        }
        catch (err) {
            this.enable = false;
            console.error(err);
        }
        console.log(data);
    };
    Logger.prototype.info = function (message) { this.writeLog("INFO", message); };
    ;
    Logger.prototype.warn = function (message) { this.writeLog("WARN", message); };
    ;
    Logger.prototype.error = function (message) { this.writeLog("ERROR", message); };
    ;
    Logger.prototype.debug = function (message) { this.writeLog("DEBUG", message); };
    ;
    return Logger;
}());
exports.default = Logger;
//# sourceMappingURL=logs.js.map