import { Message } from "discord.js";
import { deletePlayerDB, grabPlayerDB } from "../../utils/dbUtils.js";

async function leave(msg: Message): Promise<void> {
    try {
        if (!msg.guild || !msg.member) {return console.log("Invalid Operation, no dms");}

        const player = await grabPlayerDB(msg.member.id, true);
        if (!player) {
            msg.reply("You are not registered in the current event.");
            return;
        }
        await deletePlayerDB(player.discordId);
        console.log(`Player ${player.name} (${player.discordId}) has left the event!`);
        msg.reply("You have left the event, we're sorry to see you go 👋.");
    } catch (error) {
        console.error("Leave function failed", error);
    }
}

export default leave;