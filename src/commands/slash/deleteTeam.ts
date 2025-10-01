import { ChatInputCommandInteraction, MessageFlags, Role } from "discord.js";
import { grabTeamDB } from "../../utils/dbUtils.js";
import { Player } from "../../models/Player.js";
import { Team } from "../../models/Team.js";

async function deleteTeam(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.guild) {
        await interaction.reply({
            content: "This command can only be used within a server.",
            flags: MessageFlags.Ephemeral
        });
        return;
    }

    try {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const team = interaction.options.getRole("team", true);
        const dbTeam = await grabTeamDB(team.name);

        if (!dbTeam) {
            await interaction.guild.roles.delete(team.id);
            await interaction.followUp("The team belonging to this role is not registered, the role will be deleted.");
            return;
        }

        await Player.updateMany(
            {team: dbTeam._id},
            {team: null}
        )

        await Team.deleteOne({ name: team.name });

        await interaction.followUp("Team deleted successfully!"); 

        await interaction.guild.roles.delete(dbTeam.roleID);
        await interaction.guild.channels.delete(dbTeam.channelID);
       
    } catch (error) {
        console.error(`Error occured during team deletion:`, error);

        if (interaction.deferred) {
            await interaction.followUp("There was an error during team deletion, please try again.");
        } else {
            await interaction.reply({
                content: "There was an error during team deletion, please try again.",
                flags: MessageFlags.Ephemeral
            });
        }
    }
}

export default deleteTeam;