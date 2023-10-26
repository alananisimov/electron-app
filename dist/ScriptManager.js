"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var child_process_1 = require("child_process");
var os = __importStar(require("os"));
var path = __importStar(require("path"));
var node_downloader_helper_1 = require("node-downloader-helper");
var index_1 = require("./index");
var original_fs_1 = require("original-fs");
var ScriptManager = /** @class */ (function () {
    function ScriptManager(path, enable, configName, execName, appPath) {
        this.path = path;
        this.enable = enable;
        this.configName = configName;
        this.execName = execName;
        this.appPath = appPath;
    }
    ScriptManager.prototype.execute = function () {
        var _this = this;
        fs.readFile(this.configName, 'utf8', function (err, data) {
            if (err) {
                index_1.logs.error("Error reading ".concat(_this.configName, ":") + err);
                return;
            }
            try {
                var config = JSON.parse(data);
                var mode = config.mode, dota_path = config.dota_path, cs_path = config.cs_path;
                var escapedDotaPath = "".concat(dota_path);
                var escapedCsPath = "".concat(cs_path);
                (0, original_fs_1.chmodSync)(path.join(_this.path, _this.execName), "755");
                var command = "".concat(_this.path, "/").concat(_this.execName, " -m \"").concat(mode, "\" -d \"").concat(escapedDotaPath, "\" -c \"").concat(escapedCsPath, "\" -s \"").concat(os.type(), "\"");
                (0, child_process_1.exec)(command, {}, function (error, stdout, stderr) {
                    if (error) {
                        index_1.logs.error("Error executing command: ".concat(error));
                        return;
                    }
                    index_1.logs.info("Output: ".concat(stdout));
                    index_1.logs.error("Errors: ".concat(stderr));
                });
            }
            catch (err) {
                index_1.logs.error("Error parsing ".concat(_this.configName, ":") + err);
            }
        });
    };
    ScriptManager.prototype.isConfig = function () {
        return fs.existsSync(path.join(process.cwd(), '/config.json'));
    };
    ScriptManager.prototype.isExec = function () {
        var filesInCurrentDir = fs.readdirSync(this.path);
        return filesInCurrentDir.some(function (fileName) { return fileName.includes('clearSystem'); });
    };
    ScriptManager.prototype.executeScript = function () {
        return __awaiter(this, void 0, void 0, function () {
            var config, osType;
            var _this = this;
            return __generator(this, function (_a) {
                if (!this.isConfig()) {
                    config = {
                        Linux: {
                            mode: 'easy',
                            dota_path: '~/.steam/steam/SteamApps/common/dota 2 beta',
                            cs_path: '~/.steam/steam/SteamApps/common/Counter-Strike Global Offensive',
                        },
                        Darwin: {
                            mode: 'easy',
                            dota_path: '/Users/$USER/Library/Application Support/Steam/steamapps/common/dota 2 beta',
                            cs_path: '/Users/$USER/Library/Application Support/Steam/steamapps/common/Counter-Strike Global Offensive',
                        },
                        Windows_NT: {
                            mode: 'easy',
                            dota_path: 'C:/Program Files (x86)/Steam/steamapps/common/dota 2 beta',
                            cs_path: 'C:/Program Files (x86)/Steam/steamapps/common/Counter-Strike Global Offensive',
                        },
                    };
                    osType = os.type();
                    this.saveConfig(0, config[osType]).finally(function () {
                        _this.execute();
                    });
                }
                else {
                    this.execute();
                }
                return [2 /*return*/];
            });
        });
    };
    ScriptManager.prototype.saveConfig = function (_, obj) {
        return __awaiter(this, void 0, void 0, function () {
            var json;
            var _this = this;
            return __generator(this, function (_a) {
                json = JSON.stringify(obj);
                fs.writeFile(this.configName, json, 'utf8', function (err) {
                    if (err) {
                        index_1.logs.error(String(err));
                    }
                    else {
                        index_1.logs.info('File written successfully\n');
                        index_1.logs.info('The written file has the following contents:');
                        index_1.logs.info(fs.readFileSync(_this.configName, 'utf8'));
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    ScriptManager.prototype.getConfig = function () {
        return __awaiter(this, void 0, void 0, function () {
            var config_data, data, config, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config_data = {
                            "mode": "easy",
                            "dota_path": "C:/Program Files (x86)/Steam/steamapps/common/dota 2 beta",
                            "cs_path": "C:/Program Files (x86)/Steam/steamapps/common/Counter-Strike Global Offensive"
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fs.promises.readFile(this.configName, 'utf8')];
                    case 2:
                        data = _a.sent();
                        config = JSON.parse(data);
                        return [2 /*return*/, { mode: config.mode, dota_path: config.dota_path, cs_path: config.cs_path }];
                    case 3:
                        err_1 = _a.sent();
                        index_1.logs.error("Error reading ".concat(this.configName, ": ").concat(err_1));
                        return [2 /*return*/, config_data];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ScriptManager.prototype.downloadExec = function () {
        return __awaiter(this, void 0, void 0, function () {
            var DownloadUrls, filesInCurrentDir, clearSystemFile, dl;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        DownloadUrls = {
                            Windows: 'https://launcher.ezfps.store/clearSystemWindows',
                            Linux: 'https://www.ezfps.store/clearSystem',
                            Darwin: 'https://launcher.ezfps.store/clearSystemMacos',
                        };
                        console.log(DownloadUrls[os.type()]);
                        filesInCurrentDir = fs.readdirSync(this.path);
                        clearSystemFile = filesInCurrentDir.find(function (fileName) { return fileName.includes('clearSystem'); });
                        if (!this.isExec()) return [3 /*break*/, 2];
                        index_1.logs.info("File '".concat(clearSystemFile, "' with 'clearSystem' in the name already exists in the current directory"));
                        if (clearSystemFile) {
                            this.execName = clearSystemFile;
                        }
                        else {
                            throw new Error('clearSystemFile is undefined.');
                        }
                        return [4 /*yield*/, this.executeScript()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                    case 2:
                        dl = new node_downloader_helper_1.DownloaderHelper(DownloadUrls[os.type()], this.path);
                        dl.on('end', function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        index_1.logs.info('Exec file download completed');
                                        return [4 /*yield*/, this.executeScript()];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        dl.on('error', function (err) { return index_1.logs.error('Exec file download failed' + err); });
                        dl.start().catch(function (err) { return index_1.logs.error(err); });
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return ScriptManager;
}());
exports.default = ScriptManager;
//# sourceMappingURL=ScriptManager.js.map