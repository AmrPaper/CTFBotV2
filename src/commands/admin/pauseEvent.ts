import { Message } from "discord.js";
import { Player } from "../../models/Player.js";
import { Team } from "../../models/Team.js";

async function pauseEvent(msg: Message): Promise<void> {
    if (!msg.guild) {return console.log("Invalid Operation, no dms");}
        
    const user = await msg.guild.members.fetch(msg.author.id);
    if (!user.permissions.has("Administrator")) {
        msg.reply("You do not have the permission to update the event's state.");
        return console.log(`User ${user.displayName} does not have permission to use the Unlock command.`);
    }

    try {
        const now = Date.now();

        await Player.updateMany(
            { phaseStartTime: {$ne: null}},
            {
                $set: {
                    isPaused: true,
                    pauseStartTime: now
                }
            }
        );

        await Team.updateMany(
            { phaseStartTime: {$ne: null}},
            {
                $set: {
                    isPaused: true,
                    pauseStartTime: now
                }
            }
        );
        msg.reply("Event paused.");
    } catch (error) {
        msg.reply("An internal error occurred.");
        return console.error("Error occurred during leaderboard process:", error);
    }
}

export default pauseEvent;