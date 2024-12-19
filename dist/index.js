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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
var core = __importStar(require("@actions/core"));
var github = __importStar(require("@actions/github"));
var getVersion = function (version) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, {
                major: parseInt(version[1]),
                minor: parseInt(version[2]),
                patch: parseInt(version[3]),
                manifestSafeVersionString: version[1].padStart(2, "0") + "." +
                    version[2].padStart(2, "0") + "." +
                    version[3].padStart(2, "0")
            }];
    });
}); };
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var event_1, refType, branchName, regex, releaseInfo, major, minor, patch;
        var _a;
        return __generator(this, function (_b) {
            try {
                event_1 = github.context.eventName;
                if (event_1 !== "create" && event_1 !== "push" && event_1 !== "pull_request") {
                    core.setFailed("This action is only meant to be run on create, push and pull_request");
                    return [2 /*return*/];
                }
                refType = github.context.payload.ref_type;
                branchName = "";
                if (event_1 === "push" || event_1 === "create") {
                    branchName = github.context.payload.ref;
                }
                else if (event_1 === "pull_request") {
                    branchName = ((_a = github.context.payload.pull_request) === null || _a === void 0 ? void 0 : _a.base.ref) || "";
                }
                regex = new RegExp(/^(?:refs\/heads\/)?release[-\/](\d{1,5})\.(\d{1,5})(?:\.(\d{1,5}))?$/);
                releaseInfo = branchName.match(regex);
                if (releaseInfo) {
                    major = parseInt(releaseInfo[1], 10);
                    minor = parseInt(releaseInfo[2], 10);
                    patch = releaseInfo[3] ? parseInt(releaseInfo[3], 10) : 0;
                    core.setOutput("major", major);
                    core.setOutput("minor", minor);
                    core.setOutput("patch", patch);
                    core.setOutput("manifestSafeVersionString", "".concat(major.toString().padStart(2, "0"), ".").concat(minor.toString().padStart(2, "0"), ".").concat(patch.toString().padStart(2, "0")));
                    core.setOutput("versionString", "".concat(major, ".").concat(minor, ".").concat(patch));
                }
                else {
                    console.log('No match found. Ensure the branch name follows the format: release-1.2 or release-1.2.3');
                }
            }
            catch (error) {
                core.setFailed(error);
            }
            return [2 /*return*/];
        });
    });
}
run();
exports.default = run;
