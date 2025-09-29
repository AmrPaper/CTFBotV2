import { Message } from "discord.js";
import { deletePlayerDB, grabPlayerDB } from "../../utils/dbUtils.js";

async function leave(msg: Message): Promise<void> {
    try {
        if (!msg.guild || !msg.member) {return console.log("Invalid Operation, no dms");}

        const playerRole = await msg.guild.roles.cache.find(r => r.name === "Player");
        const user = await msg.guild.members.fetch(msg.author.id);
        const player = await grabPlayerDB(msg.member.id, { logIfNotFound: true });
        if (!player) {
            msg.reply("You are not registered in the current event.");
            return;
        }
        if (!playerRole) {throw new Error("Failed to fetch player role.");}
        await user.roles.remove(playerRole);
        const success = await deletePlayerDB(player.discordId);
        if (!success) {
            await user.roles.add(playerRole);
            throw new Error("Failed to delete player");
        }
        console.log(`Player ${player.name} (${player.discordId}) has left the event!`);
        msg.reply("You have left the event, we're sorry to see you go 👋.");
    } catch (error) {
        console.error("Leave function failed", error);
    }
}

export default leave;