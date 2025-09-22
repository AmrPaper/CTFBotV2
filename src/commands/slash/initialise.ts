import { ChatInputCommandInteraction } from "discord.js";

async function initialise(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.guild) {
        await interaction.reply({
            content: "This command can only be used within a server.",
            ephemeral: true
        });
        return;
    }

    try {
        await interaction.deferReply({ ephemeral: true });

        const PlayerRole = interaction.guild.roles.cache.find(role => role.name === "Player");
        const OrganiserRole = interaction.guild.roles.cache.find(role => role.name === "Organiser");

        if (PlayerRole || OrganiserRole) {
            await interaction.followUp("Player and/or Organiser roles already exist.");
            return;
        }

        const Player = await interaction.guild.roles.create({
            name: 'Player',
            colors: { primaryColor: '#c3b058'},
            mentionable: true
        });

        const Organiser = await interaction.guild.roles.create({
            name: 'Organiser',
            colors: { primaryColor: '#8cefae' },
            hoist: true,
            mentionable: true,
            position: Player.position + 1
        });

        await interaction.followUp("Player and Organiser roles created successfully! 👍");
    } catch (error) {
        console.error(`Error occured during initialisation:`, error);

        if (interaction.deferred) {
            await interaction.followUp("There was an error during role creation, please try again.");
        } else {
            await interaction.reply({
                content: "There was an error during role creation, please try again.",
                ephemeral: true
            });
        }
    }
}

export default initialise;