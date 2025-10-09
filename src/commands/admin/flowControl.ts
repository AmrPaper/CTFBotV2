import { Message } from "discord.js";
import { phaseCount, updateState } from "../../utils/lockState.js";

export async function lock(msg: Message, args: string[]): Promise<void> {
    if (!msg.guild) {return console.log("Invalid Operation, no dms");}

    const user = await msg.guild.members.fetch(msg.author.id)
    if (!user.permissions.has("Administrator")) {
        msg.reply("You do not have the permission to update the event's state.");
        return console.log(`User ${user.displayName} does not have permission to use the Lock command.`);
    }

    if (!args[0] || !args.every(item => !isNaN(Number(item)))) {
        msg.reply("Please specify a valid phase.");
        return;
    }
    let requestedPhases = args.map(Number);
    for (const phase of requestedPhases) {
        if (phase>phaseCount - 1) {
            msg.reply("Phase Unavailable, please try again");
            return console.log("User requested a non-existent phase");
        }
    }

    try {
        requestedPhases.forEach(phase => updateState(true, phase))
        msg.reply(`Phase(s) ${requestedPhases} is/are now locked!`);
    } catch (error) {
        console.log(`Error: ${error}`);
        msg.reply("There was an error updating the CTF's state, please try again.");
    }
}

export async function unlock(msg: Message, args: string[]): Promise<void> {
    if (!msg.guild) {return console.log("Invalid Operation, no dms");}

    const user = await msg.guild.members.fetch(msg.author.id)
    if (!user.permissions.has("Administrator")) {
        msg.reply("You do not have the permission to update the event's state.");
        return console.log(`User ${user.displayName} does not have permission to use the Unlock command.`);
    }

    if (!args[0] || !args.every(item => !isNaN(Number(item)))) {
        msg.reply("Please specify a valid phase.");
        return;
    }
    let requestedPhases = args.map(Number);
    for (const phase of requestedPhases) {
        if (phase>phaseCount - 1) {
            msg.reply("Phase Unavailable, please try again");
            return console.log("User requested a non-existent phase");
        }
    }

    try {
        requestedPhases.forEach(phase => updateState(false, phase))
        msg.reply(`Phase(s) ${requestedPhases} is/are now unlocked!`);
    } catch (error) {
        console.log(`Error: ${error}`);
        msg.reply("There was an error updatings the CTF's state, please try again.");
    }
}