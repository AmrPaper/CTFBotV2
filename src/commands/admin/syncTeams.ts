import { Message } from "discord.js";
import { Team } from "../../models/Team.js";
import { syncTeamMembers } from "../../utils/dbUtils.js";

async function syncTeams(msg: Message): Promise<void> {
    if (!msg.guild) {return console.log("Invalid Operation, no dms");}
        
    const user = await msg.guild.members.fetch(msg.author.id);
    if (!user.permissions.has("Administrator")) {
        msg.reply("You do not have the permission to update the event's state.");
        return console.log(`User ${user.displayName} does not have permission to use the Unlock command.`);
    }

    try {
        const teams = await Team.find().lean();
        for (const team of teams) {
            await syncTeamMembers(team.name);
        }
        msg.reply("Sync operation complete.");
    } catch (error) {
        msg.reply("An internal error occurred.");
        return console.error("Error occurred during leaderboard process:", error);
    }
}

export default syncTeams;