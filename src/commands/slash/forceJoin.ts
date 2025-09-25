import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { createPlayerDB, grabPlayerDB } from "../../utils/dbUtils.js";

async function forceJoin(interaction: ChatInputCommandInteraction): Promise<void> {
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
        const member = await interaction.guild.members.fetch(target.id);
        const player = await grabPlayerDB(target.id, {logIfNotFound: false});

        if (!player) {
            const playerData = {
                discordId: member.id,
                name: member.displayName
            }
            const success = await createPlayerDB(playerData);
            if (!success) {
                throw new Error("Failed to create new player entry in DB");
            } else {
                console.log(`Player ${playerData.name} (${playerData.discordId}) has joined the event!`)
                interaction.followUp("Player registered successfully.");
            }
        }
    } catch (error) {
        console.error(`Error occured during player addition:`, error);

        if (interaction.deferred) {
            await interaction.followUp("There was an error during player addition, please try again.");
        } else {
            await interaction.reply({
                content: "There was an error during player addition, please try again.",
                flags: MessageFlags.Ephemeral
            });
        }
    }
}

export default forceJoin;