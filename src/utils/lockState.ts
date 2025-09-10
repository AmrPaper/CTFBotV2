let lockState = true;

export function getState(): boolean {
    return lockState;
}

export function updateState(newState: boolean) {
    lockState = newState;
    if (lockState) {
        console.log("The CTF phases are now locked!");
    } else {
        console.log("The CTF phases are now unlocked!")
    }
}