import { Message } from "discord.js";
import { createPlayerDB, grabPlayerDB } from "../../utils/dbUtils.js";

async function join(msg: Message): Promise<void> {
    try {
        if (!msg.guild || !msg.member) {return console.log("Invalid Operation, no dms");}

        const user = await msg.guild.members.fetch(msg.author.id);
        const player = await grabPlayerDB(user.id, false);
        if (!player) {
            const playerData = {
                discordId : user.id,
                name: user.displayName
            }
            const success = await createPlayerDB(playerData);
            if (!success) {
                throw new Error("Failed to create new player entry in DB");
            } else {
                console.log(`Player ${playerData.name} (${playerData.discordId}) has joined the event!`)
                msg.reply("Player registered successfully.");
            }
        }
    } catch (error) {
        msg.reply("Join operation failed, please contact an admin if the issue persists.");
        console.error(`Join operation failed:`, error);
    }
}

export default join;