import { Message, EmbedBuilder } from "discord.js";
import { getState } from "../../utils/lockState.js";

async function submit(msg: Message, args: string[]): Promise<void> {
    if (!msg.guild || !msg.member) {return console.log("Invalid Operation, no dms");}

    const playerID = await msg.author.id;
    const playerRoles = await msg.member.roles.cache.map(r => r.name);

    if (!playerRoles.includes("Player")) {
        msg.reply("You are not registered in the ongoing CTF, please contact one of the organisers for assistance!");
        return console.log(`An Unregistered player ${msg.author.displayName} attempted to submit a flag.`);
    }

    let eventLocked = getState();
    if (eventLocked) {
        msg.reply("The CTF phases are currently locked, therefore submissions are currently unavailable. Please wait until an admin unlocks the challenges.");
        return console.log("User attempted to begin play.");
    }

    const phaseSuccessMessage = new EmbedBuilder()
                .setTitle("Phase Passed Successfully")
                .setDescription(`You've completed phase x!`)
                .setColor("#FFF9FB")
                .setFooter({text: "Powered by Paper 🧻",})
                .addFields({
                    name: "Instructions",
                    value: `Enter the command $phase x + 1 to proceed to the next phase!`
            },);

    //need to flesh out challenge set importing more before continuing development on this module.
}