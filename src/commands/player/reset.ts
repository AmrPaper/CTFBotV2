import { Message } from "discord.js";
import { grabPlayerDB, updatePlayerDB } from "../../utils/dbUtils.js";

async function resetProgress(msg: Message): Promise<void> {
    try {
        if (!msg.guild || !msg.member) {return console.log("Invalid Operation, no dms");}

        const player = await grabPlayerDB(msg.member.id, { logIfNotFound: true });
        if (!player) {
            msg.reply("You are not registered in the current event.");
            return;
        }
        if (player.team) {
            msg.reply("You cannot reset your progress while in a team. Please contact an admin to reset the entire team's progress or simply leave your team, that will automatically reset your progress.");
            return;
        }

        const success = await updatePlayerDB(player.discordId, {currentPhase: 1, phaseStartTime: null});
        if (!success) {
            msg.reply("Failed to reset your progress. Please contact an admin if the issue persists.");
            return;
        } else {
            console.log(`Player ${player.name} (${player.discordId}) reset their progress.`)
            msg.reply("Progress reset successfully.");
        }
    } catch (error) {
        console.error("Reset (I) function failed", error);
    }
}

export default resetProgress;