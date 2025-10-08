import { grabChallengeSet } from "../commands/admin/challengeSet.js";

const challengeSet = await grabChallengeSet();
if (!challengeSet) {
    console.error("The bot is having difficulties loading the current challenge set, please ensure the challenge sets are in the correct location and restart the bot.");
    process.exit(1);
}
export let phaseCount = challengeSet.phases.length;
let lockStates: boolean[] = [];
for (let i = 0; i<phaseCount; i++) {
    lockStates.push(true);
}

export function getState(phase: number): boolean {
    return lockStates[phase];
}

export function updateState(newState: boolean, phase: number) {
    lockStates[phase] = newState;
    if (lockStates[phase]) {
        console.log(`Phase ${phase} is now locked!`);
    } else {
        console.log(`Phase ${phase} is now unlocked!`);
    }
}