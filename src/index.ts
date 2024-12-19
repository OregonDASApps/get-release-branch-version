import * as core from '@actions/core';
import * as github from '@actions/github';

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
        const event = github.context.eventName;        
        if (event !== "create" && event !== "push" && event !== "pull_request") {
            core.setFailed("This action is only meant to be run on create, push and pull_request");
            return;
        }
        const refType = github.context.payload.ref_type;
        
        
        // Grab the branch version
        let branchName: string = ""
        if (event === "push" || event === "create") {
            branchName = github.context.payload.ref;
        } else if (event === "pull_request") {
            branchName = github.context.payload.pull_request?.base.ref || "";
        }        
        
        const regex = new RegExp(/^(?:refs\/heads\/)?release[-\/](\d{1,5})\.(\d{1,5})(?:\.(\d{1,5}))?$/);        
        const releaseInfo = branchName.match(regex);
        

        if (releaseInfo) {
            const major = parseInt(releaseInfo[1], 10);
            const minor = parseInt(releaseInfo[2], 10);
            const patch = releaseInfo[3] ? parseInt(releaseInfo[3], 10) : 0; // Default to 0 if not available
            core.setOutput("major", major);
            core.setOutput("minor", minor);
            core.setOutput("patch", patch);
            core.setOutput("manifestSafeVersionString", `${major.toString().padStart(2, "0")}.${minor.toString().padStart(2, "0")}.${patch.toString().padStart(2, "0")}`);
            core.setOutput("versionString", `${major}.${minor}.${patch}`);
        } else {
            console.log('No match found. Ensure the branch name follows the format: release-1.2 or release-1.2.3');
        }
    } catch (error: any) {
        core.setFailed(error);
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