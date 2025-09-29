import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { deletePlayerDB, grabPlayerDB } from "../../utils/dbUtils.js";

async function forceLeave(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.guild) {
        await interaction.reply({
            content: "This command can only be used within a server.",
            flags: MessageFlags.Ephemeral
        });
        return;    
    }

    const target = interaction.options.getUser("user", true);
    
    try {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        const user = await interaction.guild.members.fetch(target.id);
        const player = await grabPlayerDB(target.id, {logIfNotFound: true});
        const playerRole = await interaction.guild.roles.cache.find(r => r.name === "Player");

        if (!playerRole) {throw new Error("Failed to fetch player role.");}
        if (!player) {
            interaction.followUp("The selected player is not registered in the current event.");
            return;
        }

        await user.roles.remove(playerRole);
        const success = await deletePlayerDB(player.discordId);
        if (!success) {
            await user.roles.add(playerRole);
            throw new Error("Failed to delete player.");
        }
        console.log(`Player ${player.name} (${player.discordId}) has been removed from the event!`);
        interaction.followUp(`Player ${player.name} (${player.discordId}) has been removed from the event!`);
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

export default forceLeave;