import { existsSync, readFileSync, appendFileSync } from 'fs';
import { EOL } from 'os';
import { randomUUID } from 'crypto';

// Minimal replacements for the two @actions/core helpers this action uses
// (setOutput, setFailed) and for @actions/github's context. Inlining these
// avoids pulling in @actions/core and @actions/github, whose transitive
// dependencies (Octokit, undici) bloated the bundled dist by ~1.5 MB.

// Escape a value for the `::error::` workflow command.
const escapeData = (value: string): string =>
    value.replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A");

// Write an action output using the GITHUB_OUTPUT file (heredoc) format.
const setOutput = (name: string, value: string | number): void => {
    const filePath = process.env.GITHUB_OUTPUT;
    const converted = typeof value === "string" ? value : String(value);
    if (filePath) {
        const delimiter = `ghadelimiter_${randomUUID()}`;
        appendFileSync(filePath, `${name}<<${delimiter}${EOL}${converted}${EOL}${delimiter}${EOL}`, { encoding: "utf8" });
    } else {
        // Fallback for older runners without GITHUB_OUTPUT.
        process.stdout.write(`::set-output name=${name}::${escapeData(converted)}${EOL}`);
    }
};

// Mark the action as failed and emit an error message.
const setFailed = (message: string | Error): void => {
    process.exitCode = 1;
    const text = message instanceof Error ? message.toString() : message;
    process.stdout.write(`::error::${escapeData(text)}${EOL}`);
};

// Minimal replacement for @actions/github's context. This action only needs
// the event name and the event payload, so we read them directly instead of
// pulling in the entire @actions/github (Octokit) dependency.
interface EventPayload {
    ref_type?: string;
    ref?: string;
    pull_request?: { base: { ref: string } };
}

const eventName: string = process.env.GITHUB_EVENT_NAME || "";
const payload: EventPayload =
    process.env.GITHUB_EVENT_PATH && existsSync(process.env.GITHUB_EVENT_PATH)
        ? JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, { encoding: "utf8" }))
        : {};

const getVersion = async (version: RegExpMatchArray): Promise<Version> => {
    
    return {
        major: parseInt(version[1]),
        minor: parseInt(version[2]),
        patch: parseInt(version[3]),
        manifestSafeVersionString:
            version[1].padStart(2, "0") + "." +
            version[2].padStart(2, "0") + "." +
            version[3].padStart(2, "0")
    };
}

async function run() {
    try {
        const event = eventName;        
        if (event !== "create" && event !== "push" && event !== "pull_request") {
            setFailed("This action is only meant to be run on create, push and pull_request");
            return;
        }
        const refType = payload.ref_type;
        
        
        // Grab the branch version
        let branchName: string = ""
        if (event === "push" || event === "create") {
            branchName = payload.ref || "";
        } else if (event === "pull_request") {
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
        } else {
            console.log('No match found. Ensure the branch name follows the format: release-1.2 or release-1.2.3');
        }
    } catch (error: any) {
        setFailed(error);
    }
}

run();

interface Version {
    major: number,
    minor: number,
    patch: number,
    manifestSafeVersionString: string
}

export default run;