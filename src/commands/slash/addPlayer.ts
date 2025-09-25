import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { grabPlayerDB, grabTeamDB, syncPlayerWithTeam } from "../../utils/dbUtils.js";

async function addPlayer(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.guild) {
        await interaction.reply({
            content: "This command can only be used within a server.",
            flags: MessageFlags.Ephemeral
        });
        return;
    }

    try {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        const results: string[] = [];
        const errors: string[] = [];

        const team = interaction.options.getRole("team", true);
        const player1 = interaction.options.getUser("player1", true);
        const player2 = interaction.options.getUser("player2");
        const player3 = interaction.options.getUser("player3");

        let targetTeam = await grabTeamDB(team.name, { logIfNotFound: true });
        if (!targetTeam) {
            await interaction.followUp("The team role you've selected does not have a corresponding team registered within the database.");
            return;
        }

        const playerList = [player1, player2, player3];
        const nonNullPlayers = playerList.filter(p => p !== null);

        for (const player of nonNullPlayers) {
            let targetPlayer = await grabPlayerDB(player.id, { logIfNotFound: true });
            if (targetPlayer === null) {
                errors.push(`${player.displayName} is not registered in the event.`);
                continue;
            }
            if (targetPlayer.team) {
                errors.push(`${player.displayName} is already in a team.`);
                continue;
            } else {
                try {
                    targetTeam.members.push(targetPlayer._id);
                    await targetTeam.save();
                    await syncPlayerWithTeam(targetPlayer.discordId, targetTeam);
                    
                    const member = await interaction.guild.members.fetch(targetPlayer.discordId);
                    await member.roles.add(team.id);
                    
                    results.push(`${player.displayName} added to ${targetTeam.name}.`)
                } catch(error) {
                    targetTeam.members = targetTeam.members.filter(id => id !== targetPlayer._id);
                    await targetTeam.save();
                    errors.push(`Failed to add Discord role for ${player.displayName}.`);
                }
            }
        }

        const message = [...results, ...errors].join('\n');
        await interaction.followUp(message);
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

export default addPlayer;