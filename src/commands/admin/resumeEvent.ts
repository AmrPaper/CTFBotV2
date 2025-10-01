import { Message } from "discord.js";
import { Player } from "../../models/Player.js";
import { Team } from "../../models/Team.js";

async function resumeEvent(msg: Message): Promise<void> {
    if (!msg.guild) {return console.log("Invalid Operation, no dms");}
        
    const user = await msg.guild.members.fetch(msg.author.id);
    if (!user.permissions.has("Administrator")) {
        msg.reply("You do not have the permission to update the event's state.");
        return console.log(`User ${user.displayName} does not have permission to use the Unlock command.`);
    }

    const now = Date.now();

    try {
        const players = await Player.find({ isPaused: true });
        for (const player of players) {
            if (player.pauseStartTime && player.phaseStartTime) {
            player.totalPlaytime += (player.pauseStartTime - player.phaseStartTime);
            player.phaseStartTime = now;
            player.isPaused = false;
            player.pauseStartTime = null;
            await player.save();
            }
        }

        const teams = await Team.find({ isPaused: true });
        for (const team of teams) {
            if (team.pauseStartTime && team.phaseStartTime) {
            team.totalPlaytime += (team.pauseStartTime - team.phaseStartTime);
            team.phaseStartTime = now;
            team.isPaused = false;
            team.pauseStartTime = null;
            await team.save();
            }
        }

    } catch (error) {
        msg.reply("An internal error occurred.");
        return console.error("Error occurred during leaderboard process:", error);
    }
}

export default resumeEvent;