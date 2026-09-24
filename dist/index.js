import { createRequire as __WEBPACK_EXTERNAL_createRequire } from "module";
/******/ // The require scope
/******/ var __nccwpck_require__ = {};
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__nccwpck_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__nccwpck_require__.o(definition, key) && !__nccwpck_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__nccwpck_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};

// EXPORTS
__nccwpck_require__.d(__webpack_exports__, {
  A: () => (/* binding */ src)
});

;// CONCATENATED MODULE: external "fs"
const external_fs_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("fs");
;// CONCATENATED MODULE: external "os"
const external_os_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("os");
;// CONCATENATED MODULE: external "crypto"
const external_crypto_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("crypto");
;// CONCATENATED MODULE: ./src/index.ts



// Minimal replacements for the two @actions/core helpers this action uses
// (setOutput, setFailed) and for @actions/github's context. Inlining these
// avoids pulling in @actions/core and @actions/github, whose transitive
// dependencies (Octokit, undici) bloated the bundled dist by ~1.5 MB.
// Escape a value for the `::error::` workflow command.
const escapeData = (value) => value.replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A");
// Write an action output using the GITHUB_OUTPUT file (heredoc) format.
const setOutput = (name, value) => {
    const filePath = process.env.GITHUB_OUTPUT;
    const converted = typeof value === "string" ? value : String(value);
    if (filePath) {
        const delimiter = `ghadelimiter_${(0,external_crypto_namespaceObject.randomUUID)()}`;
        (0,external_fs_namespaceObject.appendFileSync)(filePath, `${name}<<${delimiter}${external_os_namespaceObject.EOL}${converted}${external_os_namespaceObject.EOL}${delimiter}${external_os_namespaceObject.EOL}`, { encoding: "utf8" });
    }
    else {
        // Fallback for older runners without GITHUB_OUTPUT.
        process.stdout.write(`::set-output name=${name}::${escapeData(converted)}${external_os_namespaceObject.EOL}`);
    }
};
// Mark the action as failed and emit an error message.
const setFailed = (message) => {
    process.exitCode = 1;
    const text = message instanceof Error ? message.toString() : message;
    process.stdout.write(`::error::${escapeData(text)}${external_os_namespaceObject.EOL}`);
};
const eventName = process.env.GITHUB_EVENT_NAME || "";
const payload = process.env.GITHUB_EVENT_PATH && (0,external_fs_namespaceObject.existsSync)(process.env.GITHUB_EVENT_PATH)
    ? JSON.parse((0,external_fs_namespaceObject.readFileSync)(process.env.GITHUB_EVENT_PATH, { encoding: "utf8" }))
    : {};
const getVersion = async (version) => {
    return {
        major: parseInt(version[1]),
        minor: parseInt(version[2]),
        patch: parseInt(version[3]),
        manifestSafeVersionString: version[1].padStart(2, "0") + "." +
            version[2].padStart(2, "0") + "." +
            version[3].padStart(2, "0")
    };
};
async function run() {
    try {
        const event = eventName;
        if (event !== "create" && event !== "push" && event !== "pull_request") {
            setFailed("This action is only meant to be run on create, push and pull_request");
            return;
        }
        const refType = payload.ref_type;
        // Grab the branch version
        let branchName = "";
        if (event === "push" || event === "create") {
            branchName = payload.ref || "";
        }
        else if (event === "pull_request") {
            branchName = payload.pull_request?.base.ref || "";
        }
        const regex = new RegExp(/^(?:refs\/heads\/)?release[-\/](\d{1,5})\.(\d{1,5})(?:\.(\d{1,5}))?$/);
        const releaseInfo = branchName.match(regex);
        if (releaseInfo) {
            const major = parseInt(releaseInfo[1], 10);
            const minor = parseInt(releaseInfo[2], 10);
            const patch = releaseInfo[3] ? parseInt(releaseInfo[3], 10) : 0; // Default to 0 if not available
            setOutput("major", major);
            setOutput("minor", minor);
            setOutput("patch", patch);
            setOutput("manifestSafeVersionString", `${major.toString().padStart(2, "0")}.${minor.toString().padStart(2, "0")}.${patch.toString().padStart(2, "0")}`);
            setOutput("versionString", `${major}.${minor}.${patch}`);
        }
        else {
            console.log('No match found. Ensure the branch name follows the format: release-1.2 or release-1.2.3');
        }
    }
    catch (error) {
        setFailed(error);
    }
}
run();
/* harmony default export */ const src = (run);

var __webpack_exports__default = __webpack_exports__.A;
export { __webpack_exports__default as default };
