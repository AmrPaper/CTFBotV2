import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { grabPlayerDB, updatePlayerDB } from "../../utils/dbUtils.js";
import { Team } from "../../models/Team.js";

async function removePlayer(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.guild) {
        await interaction.reply({
            content: "This command can only be used within a server.",
            flags: MessageFlags.Ephemeral
        });
        return;    
    }

    const target = interaction.options.getUser("user", true);

    try {
        interaction.deferReply({ flags: MessageFlags.Ephemeral });
        let player = await grabPlayerDB(target.id, {logIfNotFound: true});

        if (!player) {
            interaction.followUp("The selected player is not registered in the current event.");
            return;
        }
        if (!player.team) {
            interaction.followUp("The selected player is not in a team.");
            return;
        }
        await Team.updateMany(
            { members: player._id },
            { $pull: { members: player._id } }
        );

        const success = await updatePlayerDB(player.discordId, {currentPhase: 1, phaseStartTime: null, team: null});
        if (!success) {
            interaction.followUp("Failed to reset player progress and remove them from their team. Please contact an admin if the issue persists.");                    return;
        } else {
            console.log(`Player ${player.name} (${player.discordId}) status updated successfully.`)
            interaction.followUp("Player status updated successfully.");
        }

    } catch (error) {
        console.error(`Error occured during player removal:`, error);

        if (interaction.deferred) {
            await interaction.followUp("There was an error during player removal, please try again.");
        } else {
            await interaction.reply({
                content: "There was an error during player removal, please try again.",
                flags: MessageFlags.Ephemeral
            });
        }
    }
}

export default removePlayer;