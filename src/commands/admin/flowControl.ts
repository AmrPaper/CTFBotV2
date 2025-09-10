import { Message } from "discord.js";
import { updateState } from "../../utils/lockState.js";

export async function lock(msg: Message): Promise<void> {
    if (!msg.guild) {return console.log("Invalid Operation, no dms");}

    const user = await msg.guild.members.fetch(msg.author.id)
    if (!user.permissions.has("Administrator")) {
        msg.reply("You do not have the permission to update the event's state.");
        return console.log(`User ${user.displayName} does not have permission to use the Lock command.`);
    }

    try {
        updateState(true);
        msg.reply("The CTF phases are now locked!");
    } catch (error) {
        console.log(`Error: ${error}`);
        msg.reply("There was an error updating the CTF's state, please try again.");
    }
}

export async function unlock(msg: Message): Promise<void> {
    if (!msg.guild) {return console.log("Invalid Operation, no dms");}

    const user = await msg.guild.members.fetch(msg.author.id)
    if (!user.permissions.has("Administrator")) {
        msg.reply("You do not have the permission to update the event's state.");
        return console.log(`User ${user.displayName} does not have permission to use the Unlock command.`);
    }

    try {
        updateState(false);
        msg.reply("The CTF phases are now unlocked!");
    } catch (error) {
        console.log(`Error: ${error}`);
        msg.reply("There was an error updatings the CTF's state, please try again.");
    }
}