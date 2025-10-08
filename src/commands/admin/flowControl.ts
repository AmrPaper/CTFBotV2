import { Message } from "discord.js";
import { phaseCount, updateState } from "../../utils/lockState.js";

export async function lock(msg: Message, args: string[]): Promise<void> {
    if (!msg.guild) {return console.log("Invalid Operation, no dms");}

    const user = await msg.guild.members.fetch(msg.author.id)
    if (!user.permissions.has("Administrator")) {
        msg.reply("You do not have the permission to update the event's state.");
        return console.log(`User ${user.displayName} does not have permission to use the Lock command.`);
    }

    if (!args[0] || isNaN(Number(args[0]))) {
        msg.reply("Please specify a valid phase.");
        return;
    }
    let requestedPhase: number = Number(args[0]);
    if (requestedPhase>phaseCount - 1) {
        msg.reply("Phase Unavailable, please try again");
        return console.log("User requested a non-existent phase");
    }

    try {
        updateState(true, requestedPhase);
        msg.reply(`Phase ${requestedPhase} is now locked!`);
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

    if (!args[0] || isNaN(Number(args[0]))) {
        msg.reply("Please specify a valid phase.");
        return;
    }
    let requestedPhase: number = Number(args[0]);
    if (requestedPhase>phaseCount - 1) {
        msg.reply("Phase Unavailable, please try again");
        return console.log("User requested a non-existent phase");
    }

    try {
        updateState(false, requestedPhase);
        msg.reply(`Phase ${requestedPhase} is now unlocked!`);
    } catch (error) {
        console.log(`Error: ${error}`);
        msg.reply("There was an error updatings the CTF's state, please try again.");
    }
}